import { type NextRequest, NextResponse } from "next/server";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";

let xata = getXataClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    await getMyProfileOrThrow();

    let profiles = await xata.db.rel_profiles
      .select([
        "profile_b.handle",
        "profile_b.name",
        "profile_b.profile_picture.*",
        "profile_b.bio",
        "profile_b.school.handle",
      ])
      .filter({
        "profile_a.handle": params.handle,
      })
      .getPaginated({
        pagination: {
          size: 10,
          offset: page * 10,
        },
      });

    let has_more = profiles.hasNextPage();

    return NextResponse.json(
      {
        status: "success",
        data: {
          profiles: profiles.records.map((rel) => ({
            ...rel.profile_b,
          })),
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
