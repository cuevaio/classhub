import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let profile = await getMyProfileOrThrow();
    return NextResponse.json(
      {
        profile,
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
