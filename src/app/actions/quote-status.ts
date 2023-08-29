"use server";

import { Matrix } from "ml-matrix";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { OpenAI } from "@/lib/openai";
import { getXataClient } from "@/lib/xata";

let xata = getXataClient();
import { type ServerActionResponse } from "@/lib/types/server-action-response";

async function QuoteStatusAction(data: FormData): Promise<
  ServerActionResponse<{
    quote_count: number;
    quote_id: string;
  }>
> {
  try {
    let body: string = "";
    let parsed_body = data.get("body");
    if (parsed_body) {
      body = String(parsed_body);
    }

    let parent_status = await xata.db.status.readOrThrow(
      data.get("parent_status") as string
    );

    if (body.length < 3 || body.length > 280) {
      throw Error(
        "El estado debe tener como mínimo 3 caracteres y como máximo 280."
      );
    }

    let profile = await getMyProfileOrThrow();

    const response = await OpenAI.embeddings.create({
      model: "text-embedding-ada-002",
      input: body + parent_status.body,
    });

    const embedding = response.data[0].embedding;

    const quote_status = await xata.db.status.create({
      body,
      author_profile: profile.id,
      embedding: embedding,
      quote_from: parent_status.id,
    });

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

    let updated_parent_status = await parent_status.update({
      quote_count: {
        $increment: 1,
      },
    });

    let rel_profile_parent_status = await xata.db.rel_profile_status
      .filter({
        "profile.id": profile.id,
        "status.id": parent_status.id,
      })
      .getFirst();

    if (!rel_profile_parent_status) {
      rel_profile_parent_status = await xata.db.rel_profile_status.create({
        profile: profile.id,
        status: parent_status.id,
        quote_count: 1,
      });
    } else {
      rel_profile_parent_status = await rel_profile_parent_status.update({
        quote_count: {
          $increment: 1,
        },
      });
    }

    return {
      status: "success",
      data: {
        quote_count: updated_parent_status?.quote_count || 0,
        quote_id: quote_status.id,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export { QuoteStatusAction };
