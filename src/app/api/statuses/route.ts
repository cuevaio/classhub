import { type NextRequest, NextResponse } from "next/server";

import { getXataClient } from "@/lib/xata";
import { validateStatus, validateOptions } from "@/lib/validation/status";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { OpenAI } from "@/lib/openai";
import { Matrix } from "ml-matrix";

let xata = getXataClient();

function getCosineSimilarity(A: number[], B: number[]) {
  const matrixA = Matrix.columnVector(A);
  const matrixB = Matrix.columnVector(B);
  const dotProduct = matrixA.mmul(matrixB.transpose());
  const normA = matrixA.norm("frobenius");
  const normB = matrixB.norm("frobenius");
  return dotProduct.div(normA * normB).get(0, 0);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    let profile = await getMyProfileOrThrow();
    let profile_embedding =
      profile.embedding || Matrix.zeros(1536, 1).getColumn(0);

    let only_statuses = await xata.db.status.search("a e i o u", {
      boosters: [
        {
          dateBooster: {
            column: "xata.createdAt",
            decay: 0.5,
            scale: "7d",
            factor: 3,
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
      .filter({
        id: {
          $any: only_statuses.map((status) =>
            status.author_profile ? status.author_profile.id : ""
          ),
        },
      })
      .getAll();

    let quoted_statuses = await xata.db.status
      .select(["*", "author_profile.*"])
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
      similarity: status.embedding
        ? getCosineSimilarity(profile_embedding, status.embedding)
        : 0,
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

    const { status, author, audience } = (await request.json()) as {
      status: string;
      author: string;
      audience: string;
    };

    let validStatus = validateStatus(status);
    let validOptions = validateOptions({ author, audience });

    if (validStatus !== "VALID" || validOptions !== "VALID") {
      return NextResponse.json(
        {},
        {
          status: 400,
        }
      );
    }

    const response = await OpenAI.embeddings.create({
      model: "text-embedding-ada-002",
      input: status,
    });

    const embedding = response.data[0].embedding;

    const newStatus = await xata.db.status.create({
      body: status,
      embedding,
      author_profile: author === "user" ? profile.id : null,
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
    }

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
