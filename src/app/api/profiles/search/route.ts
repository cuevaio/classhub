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

    let has_more = profiles.length === 10;

    return NextResponse.json(
      {
        status: "success",
        data: {
          profiles: profiles.filter((profile) => profile.id !== my_profile.id),
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
