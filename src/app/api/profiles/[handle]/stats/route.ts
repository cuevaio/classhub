import { type NextRequest, NextResponse } from "next/server";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";

let xata = getXataClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;
    const profile_a = await getMyProfileOrThrow();
    const profile_b = await xata.db.profile.filter({ handle }).getFirst();

    if (!profile_b) throw new Error("Profile not found");

    const rel_users = await xata.db.rel_profiles
      .filter({
        "profile_a.id": profile_a.id,
        "profile_b.id": profile_b.id,
      })
      .getFirst();

    if (rel_users) {
      return NextResponse.json(
        {
          following: rel_users.a_follows_b,
          follower_count: profile_b.follower_count,
          following_count: profile_b.following_count,
          like_count: profile_b.like_count,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          following: false,
          follower_count: profile_b.follower_count,
          following_count: profile_b.following_count,
          like_count: profile_b.like_count,
        },
        {
          status: 200,
        }
      );
    }
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
