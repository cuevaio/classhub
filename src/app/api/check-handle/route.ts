import { getMyProfile } from "@/lib/auth/get-my-profile";
import { checkIsValidHandle } from "@/utils/check-is-valid-handle";
import { type NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/lib/xata";
import { getAuthSession } from "@/lib/auth/get-auth-session";

let xata = getXataClient();

export async function GET(request: NextRequest) {
  try {
    let session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Not logged in",
        },
        {
          status: 401,
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const handle = searchParams.get("handle");

    if (!handle) {
      return NextResponse.json(
        {
          error: "NO_HANDLE",
        },
        {
          status: 400,
        }
      );
    }

    let valid = checkIsValidHandle(handle);

    if (valid !== "VALID") {
      return NextResponse.json(
        {
          error: valid,
        },
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
        {
          error: "TAKEN",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        valid: true,
      },
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
