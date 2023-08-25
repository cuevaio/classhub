import { type NextRequest, NextResponse } from "next/server";

import { getXataClient } from "@/lib/xata";
import { validateStatus, validateOptions } from "@/lib/validation/status";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { OpenAI } from "@/lib/openai";
import { Matrix } from "ml-matrix";

let xata = getXataClient();

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
