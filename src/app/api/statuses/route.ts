import { type NextRequest, NextResponse } from "next/server";

import { getXataClient } from "@/lib/xata";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { OpenAI } from "@/lib/openai";
import { Matrix } from "ml-matrix";

let xata = getXataClient();

import { NewStatusSchema } from "@/lib/form-schemas/new-status";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    let q = searchParams.get("q");
    await getMyProfileOrThrow();

    let only_statuses = await xata.db.status.search(q || "a e i o u", {
      boosters: [
        {
          dateBooster: {
            column: "xata.createdAt",
            decay: 0.05,
            scale: "7d",
            factor: 100,
          },
        },
        { numericBooster: { column: "like_count", factor: 2 } },
        { numericBooster: { column: "reply_count", factor: 3 } },
        { numericBooster: { column: "quote_count", factor: 4 } },
      ],
      fuzziness: 2,
      page: {
        size: 10,
        offset: page * 10,
      },
      filter: {
        $notExists: "reply_to",
      },
    });

    let has_more = only_statuses.length === 10;

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
      author_profile: profiles.find(
        (profile) => profile.id === status.author_profile?.id
      ),
      quote_from: quoted_statuses.find(
        (quoted_status) => quoted_status.id === status.quote_from?.id
      ),
      xata: {
        createdAt: status.xata.createdAt,
      },
    }));

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

    let request_body = await request.json();

    let { body, author_option, audience_option } =
      NewStatusSchema.parse(request_body);

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
    }20

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
