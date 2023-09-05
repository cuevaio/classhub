import { type NextRequest, NextResponse } from "next/server";

import { getXataClient } from "@/lib/xata";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";

let xata = getXataClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    await getMyProfileOrThrow();

    let statuses = await xata.db.status
      .select([
        "id",
        "body",
        "like_count",
        "quote_count",
        "reply_count",
        "xata.createdAt",

        "quote_from.id",
        "quote_from.body",
        "quote_from.like_count",
        "quote_from.quote_count",
        "quote_from.reply_count",
        "quote_from.xata.createdAt",

        "quote_from.author_profile.handle",
        "quote_from.author_profile.name",
        "quote_from.author_profile.profile_picture",
        "quote_from.author_profile.bio",
      ])
      .filter({
        "author_profile.handle": params.handle,
      })
      .sort("xata.createdAt", "desc")
      .getPaginated({
        pagination: {
          size: 10,
          offset: page * 10,
        },
      });

    let has_more = statuses.hasNextPage();

    return NextResponse.json(
      {
        status: "success",
        data: {
          statuses: statuses.records,
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
