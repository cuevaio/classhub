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

        {
          name: "<-image.status",
          as: "images",
          columns: ["id", "alt", "file.*"],
        },

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
        $notExists: "reply_to",
      })
      .sort("xata.createdAt", "desc")
      .getPaginated({
        pagination: {
          size: 10,
          offset: page * 10,
        },
      });

    let quotes_images = await xata.db.image
      .select(["id", "alt", "file.*", "status.id"])
      .filter({
        "status.id": {
          $any: statuses.records.map((status) =>
            status.quote_from ? status.quote_from.id : ""
          ),
        },
      })
      .getAll();

    let has_more = statuses.hasNextPage();

    return NextResponse.json(
      {
        status: "success",
        data: {
          statuses: statuses.records.map((status) => ({
            ...status,
            xata: {
              createdAt: status.xata.createdAt,
            },
            quote_from: status.quote_from && {
              ...status.quote_from,
              xata: {
                createdAt: status.quote_from?.xata.createdAt,
              },
              images: {
                records: quotes_images?.filter(
                  (image) => image?.status?.id === status?.quote_from?.id
                ),
              },
            },
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
