import { type NextRequest, NextResponse } from "next/server";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getProfile } from "@/lib/queries/get-profile";

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;
    await getMyProfileOrThrow();

    let profile = await getProfile(handle);

    return NextResponse.json(
      {
        profile,
      },
      {
        status: 200,
      }
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
