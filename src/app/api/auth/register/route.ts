import { getMyProfile } from "@/lib/auth/get-my-profile";
import { checkIsValidHandle } from "@/utils/check-is-valid-handle";
import { type NextRequest, NextResponse } from "next/server";
import { getMyEmailOrSignIn } from "@/lib/auth/get-my-email";
import { OpenAI } from "@/lib/openai";

import { getXataClient } from "@/lib/xata";
let xata = getXataClient();

export async function POST(request: NextRequest) {
  try {
    let email = await getMyEmailOrSignIn();
    let profile = await getMyProfile();

    if (profile) {
      return NextResponse.redirect(`/app/${profile.handle}`);
    }
    const { name, handle, bod } = await request.json();

    if (!handle || !name || !bod) {
      return NextResponse.json({
        status: 400,
      });
    }

    if (
      typeof handle !== "string" ||
      typeof name !== "string" ||
      typeof bod !== "string"
    ) {
      return NextResponse.json({
        status: 400,
      });
    }

    if (name.length < 3 || name.length > 30) {
      return NextResponse.json({
        status: 400,
      });
    }

    let birthdate = new Date(bod);

    let valid = checkIsValidHandle(handle);

    if (valid !== "VALID") {
      return NextResponse.json({
        status: 400,
      });
    }

    let xata_profile = await xata.db.profile
      .select(["handle", "name"])
      .filter({ handle: handle })
      .getFirst();

    if (xata_profile) {
      return NextResponse.json({
        status: 400,
      });
    }

    let school = await xata.db.school
      .filter({
        domain: email.split("@")[1],
      })
      .getFirst();

    if (!school) {
      school = await xata.db.school.create({
        domain: email.split("@")[1],
        handle: email.split("@")[1],
        student_count: 1,
      });
    }

    const response = await OpenAI.embeddings.create({
      model: "text-embedding-ada-002",
      input: name,
    });

    const embedding = response.data[0].embedding;

    let last_created = await xata.db.profile
      .sort("xata.createdAt", "desc")
      .getFirstOrThrow();

    await xata.db.profile.create({
      handle: handle,
      embedding,
      name,
      email,
      school: school?.id,
      birthdate,
      order: (last_created?.order || 1000000) + 1,
    });

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          typeof error === "string"
            ? error
            : error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
