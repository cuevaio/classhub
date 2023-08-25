import { getMyProfile } from "@/lib/auth/get-my-profile";
import { checkIsValidHandle } from "@/utils/check-is-valid-handle";
import { type NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/lib/xata";

let xata = getXataClient();

export async function GET(request: NextRequest) {
  try {
    let profile = await getMyProfile();

    if (profile) {
      return NextResponse.redirect("/dashboard");
    }

    const { searchParams } = new URL(request.url);
    const handle = searchParams.get("handle");

    if (!handle) {
      return NextResponse.json(
        {},
        {
          status: 400,
        }
      );
    }

    let valid = checkIsValidHandle(handle);

    if (valid !== "VALID") {
      return NextResponse.json(
        {},
        {
          status: 400,
        }
      );
    }

    let xata_profile = await xata.db.profile
      .select(["handle", "name"])
      .filter({ handle: handle })
      .getFirst();

    if (xata_profile) {
      return NextResponse.json(
        {},
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {},
      {
        status: 200,
      }
    );
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
