import { getMyEmail } from "@/lib/auth/get-my-email";
import { getMyProfile } from "@/lib/auth/get-my-profile";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let email = await getMyEmail();
    if (!email) {
      return NextResponse.json(
        {
          error: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    let profile = await getMyProfile();
    return NextResponse.json(
      {
        complete: !!profile,
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
