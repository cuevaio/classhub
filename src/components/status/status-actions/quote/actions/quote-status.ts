"use server";

import { Matrix } from "ml-matrix";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { OpenAI } from "@/lib/openai";
import { getXataClient } from "@/lib/xata";
let xata = getXataClient();
async function QuoteStatusAction(data: FormData) {
  try {
    let body: string = "";
    let parsed_body = data.get("body");
    if (parsed_body) {
      body = String(parsed_body);
    }

    const original_status = await xata.db.status.readOrThrow(
      data.get("original_status") as string
    );

    if (body.length < 3 || body.length > 280) {
      throw Error(
        "El estado debe tener como mínimo 3 caracteres y como máximo 280."
      );
    }

    let profile = await getMyProfileOrThrow();

    const response = await OpenAI.embeddings.create({
      model: "text-embedding-ada-002",
      input: body + original_status.body,
    });

    const embedding = response.data[0].embedding;

    const status = await xata.db.status.create({
      body,
      author_profile: profile.id,
      embedding: embedding,
      quote_from: original_status.id,
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
    return status.id.replace("rec_", "");
  } catch (error) {
    console.log(error);
  }
}

export { QuoteStatusAction };
