import { getMyProfile } from "@/lib/auth/get-my-profile";
import { checkIsValidHandle } from "@/utils/check-is-valid-handle";
import { type NextRequest, NextResponse } from "next/server";
import { getMyEmailOrSignIn } from "@/lib/auth/get-my-email";

import { getXataClient } from "@/lib/xata";
let xata = getXataClient();

export async function POST(request: NextRequest) {
  try {
    let email = await getMyEmailOrSignIn();
    let profile = await getMyProfile();

    if (profile) {
      return NextResponse.redirect("/dashboard");
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

    await xata.db.profile.create({
      handle: handle,
      name,
      email,
      school: school?.id,
      birthdate
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
