import { type NextRequest, NextResponse } from "next/server";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";
const xata = getXataClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const profile = await getMyProfileOrThrow();
    const status = await xata.db.status.readOrThrow(id);

    const rel_profile_status = await xata.db.rel_profile_status
      .filter({
        profile: profile.id,
        status: status.id,
      })
      .getFirst();

    return NextResponse.json(
      {
        is_liked: rel_profile_status?.like ?? false,
        is_saved: rel_profile_status?.save ?? false,
        is_quoted: rel_profile_status?.quote_count
          ? rel_profile_status.quote_count > 0
          : false,
        is_replied: rel_profile_status?.reply_count
          ? rel_profile_status.reply_count > 0
          : false,
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
