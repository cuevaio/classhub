import { type NextRequest, NextResponse } from "next/server";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";

let xata = getXataClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params;
    let profile_a = await getMyProfileOrThrow();
    let profile_b = await xata.db.profile.filter({ handle }).getFirst();

    if (!profile_b) throw new Error("Profile not found");

    const rel_users = await xata.db.rel_profiles
      .filter({
        "profile_a.id": profile_a.id,
        "profile_b.id": profile_b.id,
      })
      .getFirst();

    let endsFollowing = true;

    if (rel_users) {
      endsFollowing = !rel_users.a_follows_b;
      await rel_users.update({
        a_follows_b: !rel_users.a_follows_b,
      });
    } else {
      await xata.db.rel_profiles.create({
        profile_a: profile_a.id,
        profile_b: profile_b.id,
        a_follows_b: true,
      });
    }

    profile_b =
      (await profile_b.update({
        follower_count: { $increment: endsFollowing ? 1 : -1 },
      })) || profile_b;

    profile_a = (await profile_a.update({
      following_count: { $increment: endsFollowing ? 1 : -1 },
    })) as any;

    return NextResponse.json(
      {
        data: {
          following: endsFollowing,
          follower_count: profile_b.follower_count,
          following_count: profile_b.following_count,
          like_count: profile_b.like_count,
        },
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
