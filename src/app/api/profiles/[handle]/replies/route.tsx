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

    let replies = await xata.db.status
      .select([
        "id",
        "body",
        "like_count",
        "quote_count",
        "reply_count",
        "xata.createdAt",

        "reply_to.id",
        "reply_to.body",
        "reply_to.like_count",
        "reply_to.quote_count",
        "reply_to.reply_count",
        "reply_to.xata.createdAt",

        "reply_to.author_profile.handle",
        "reply_to.author_profile.name",
        "reply_to.author_profile.profile_picture",
        "reply_to.author_profile.bio",

        "reply_to.quote_from.id",
        "reply_to.quote_from.body",
        "reply_to.quote_from.like_count",
        "reply_to.quote_from.quote_count",
        "reply_to.quote_from.reply_count",
        "reply_to.quote_from.xata.createdAt",

        // @ts-ignore
        "reply_to.quote_from.author_profile.handle",
        // @ts-ignore
        "reply_to.quote_from.author_profile.name",
        // @ts-ignore
        "reply_to.quote_from.author_profile.profile_picture",
        // @ts-ignore
        "reply_to.quote_from.author_profile.bio",
      ])
      .filter({
        "author_profile.handle": params.handle,
        $exists: "reply_to",
        $notExists: "reply_to.reply_to",
      })
      .sort("xata.createdAt", "desc")
      .getPaginated({
        pagination: {
          size: 10,
          offset: page * 10,
        },
      });

    let has_more = replies.hasNextPage();

    return NextResponse.json(
      {
        status: "success",
        data: {
          replies: replies.records,
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
