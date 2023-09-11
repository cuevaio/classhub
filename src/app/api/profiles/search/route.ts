import { type NextRequest, NextResponse } from "next/server";

import { getXataClient } from "@/lib/xata";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";

let xata = getXataClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    let q = searchParams.get("q");
    let my_profile = await getMyProfileOrThrow();

    let profiles = await xata.db.profile.search(q || "a e i o u", {
      boosters: [
        {
          dateBooster: {
            column: "xata.createdAt",
            decay: 0.5,
            scale: "7d",
            factor: 3,
          },
        },
        { numericBooster: { column: "like_count", factor: 2 } },
      ],
      fuzziness: 2,
      page: {
        size: 10,
        offset: page * 10,
      },
    });

    let profile_pictures = await xata.db.profile
      .filter({
        id: {
          $any: profiles.map((profile) => profile.id),
        },
      })
      .select(["id", "profile_picture.*"])
      .getAll();

    let schools = await xata.db.school
      .filter({
        id: {
          $any: profiles.map((profile) => profile.school?.id || ""),
        },
      })
      .getAll();

    let has_more = profiles.length === 10;

    let profiles_to_return = profiles
      .filter((profile) => profile.id !== my_profile.id)
      .map((profile) => ({
        ...profile,
        school: schools.find(
          (school) => school.id === profile.school?.id || ""
        ),
        profile_picture: profile_pictures.find(
          (profile_picture) => profile_picture.id === profile.id
        )?.profile_picture,
      }));

    return NextResponse.json(
      {
        status: "success",
        data: {
          profiles: profiles_to_return,
          has_more,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
