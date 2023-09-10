import { type NextRequest, NextResponse } from "next/server";

import { getXataClient } from "@/lib/xata";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { OpenAI } from "@/lib/openai";
import { Matrix } from "ml-matrix";

let xata = getXataClient();

import { NewStatusSchema } from "@/lib/form-schemas/new-status";

let weights = [
  1, // like_count
  2, // save_count
  3, // reply_count
  4, // quote_count
  50, // creation
];

let weightsRow = Matrix.columnVector(weights);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    let school = searchParams.get("school");
    let exclusive_to_school = school === "true";
    let profile = await getMyProfileOrThrow();

    if (!profile.embedding) {
      return NextResponse.json(
        {
          status: "error",
          error: "You need to set your embedding first",
        },
        {
          status: 400,
        }
      );
    }

    let filter = {
      $notExists: "reply_to",
    };

    if (exclusive_to_school) {
      filter = {
        ...filter,
        "exclusive_to_school.id": profile.school?.id || "",
      };
    }

    let results = await xata.db.status.vectorSearch(
      "embedding",
      profile.embedding,
      {
        size: 100,
        filter,
      }
    );

    let metadata = await xata.db.status
      .filter({
        id: {
          $any: results.map((status) => status.id),
        },
      })
      .select(["id", "xata.createdAt"])
      .getAll();

    let statuses_with_scores = results.map((status) => {
      let metadata_status = metadata.find(
        (metadata_status) => metadata_status.id === status.id
      );

      if (!metadata_status) {
        throw new Error("Metadata not found");
      }

      let creation_feature = -Math.log(
        new Date().getTime() - metadata_status.xata.createdAt.getTime()
      );

      let status_feautures = [
        status.like_count, // like_count
        status.save_count, // save_count
        status.reply_count, // reply_count
        status.quote_count, // quote_count
        creation_feature, // creation
      ];

      let status_matrix = Matrix.rowVector(status_feautures);

      let score = status_matrix.mmul(weightsRow).get(0, 0);

      return {
        ...status,
        xata: {
          createdAt: metadata_status.xata.createdAt,
        },
        score,
      };
    });

    let only_statuses = statuses_with_scores
      .sort((a, b) => b.score - a.score)
      .slice(page * 10, page * 10 + 10);

    let profiles = await xata.db.profile
      .select([
        "bio",
        "profile_picture",
        "name",
        "handle",
        "follower_count",
        "like_count",
        "following_count",
        "school.handle",
        "email",
      ])
      .filter({
        id: {
          $any: only_statuses.map((status) =>
            status.author_profile ? status.author_profile.id : ""
          ),
        },
      })
      .getAll();

    let images = await xata.db.image
      .filter({
        "status.id": {
          $any: only_statuses.map((status) => status.id),
        },
      })
      .getAll();

    let quoted_statuses = await xata.db.status
      .select([
        "id",
        "body",
        "like_count",
        "quote_count",
        "reply_count",
        "xata.createdAt",

        "author_profile.handle",
        "author_profile.name",
        "author_profile.profile_picture",
        "author_profile.bio",

        {
          name: "<-image.status",
          as: "images",
          columns: ["id", "alt", "file.*"],
        },
      ])
      .filter({
        id: {
          $any: only_statuses.map((status) =>
            status.quote_from ? status.quote_from.id : ""
          ),
        },
      })
      .getAll();

    let statuses = only_statuses.map((status) => ({
      ...status,
      embedding: undefined,
      author_profile: profiles.find(
        (profile) => profile.id === status.author_profile?.id
      ),
      quote_from: quoted_statuses.find(
        (quoted_status) => quoted_status.id === status.quote_from?.id
      ),
      images: {
        records: images.filter((image) => image?.status?.id === status.id),
      },
    }));

    let has_more = statuses.length === 10;

    return NextResponse.json(
      {
        status: "success",
        data: {
          statuses,
          has_more,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getMyProfileOrThrow();

    let form_data = await request.formData();

    let { body, author_option, audience_option } = NewStatusSchema.parse({
      body: form_data.get("body"),
      author_option: form_data.get("author_option"),
      audience_option: form_data.get("audience_option"),
    });

    if (author_option === "anonymous" && audience_option === "circle") {
      return NextResponse.json(
        {
          error: "You can't post anonymously to your circle",
        },
        {
          status: 400,
        }
      );
    }

    const response = await OpenAI.embeddings.create({
      model: "text-embedding-ada-002",
      input: body,
    });

    const embedding = response.data[0].embedding;

    const newStatus = await xata.db.status.create({
      body,
      embedding,
      author_profile: author_option === "user" ? profile.id : null,
      exclusive_to_circle: audience_option === "circle",
      exclusive_to_school: audience_option === "school" ? profile.school : null,
    });

    let images = [];

    let i = 0;
    while (true) {
      let file: FormDataEntryValue | File | null = form_data.get(`file-${i}`);
      let alt = form_data.get(`alt-${i}`);

      if (!file) {
        break;
      }

      file = file as File;

      let fileName: string = file.name;
      let mimeType = file.type;
      let fileData = Buffer.from(await file.arrayBuffer());

      images.push({
        alt: alt ? alt.toString() : null,
        file: {
          name: fileName,
          mediaType: mimeType,
          // Xata expects a base64 encoded string for the file content
          base64Content: fileData.toString("base64"),
        },
        status: newStatus.id,
      });

      i++;
    }

    await xata.db.image.create(images);

    // TODO: Add audience to status

    if (!profile.embedding) {
      await profile.update({
        embedding,
      });
    } else {
      const old_matrix = Matrix.columnVector(profile.embedding);
      const new_matrix = Matrix.columnVector(embedding);
      const updated_matrix = old_matrix.mul(0.8).add(new_matrix.mul(0.2));

      await profile.update({
        embedding: updated_matrix.getColumn(0),
      });
    }
    20;

    return NextResponse.json(
      {
        id: newStatus.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
