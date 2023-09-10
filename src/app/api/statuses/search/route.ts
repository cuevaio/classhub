import { type NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/lib/xata";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";

let xata = getXataClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    let q = searchParams.get("q");
    await getMyProfileOrThrow();

    if (!q) {
      return NextResponse.json(
        {
          status: "error",
          error: "Missing query",
        },
        { status: 400 }
      );
    }

    let only_statuses = await xata.db.status.search(q, {
      target: ["body"],
      boosters: [
        {
          dateBooster: {
            column: "xata.createdAt",
            decay: 0.05,
            scale: "7d",
            factor: 100,
          },
        },
        { numericBooster: { column: "like_count", factor: 2 } },
        { numericBooster: { column: "reply_count", factor: 3 } },
        { numericBooster: { column: "quote_count", factor: 4 } },
      ],
      fuzziness: 2,
      page: {
        size: 10,
        offset: page * 10,
      },
      filter: {
        $notExists: "reply_to",
      },
    });

    let has_more = only_statuses.length === 10;

    let profiles = await xata.db.profile
      .select([
        "bio",
        "profile_picture",
        "name",
        "handle",
        "follower_count",
        "like_count",
        "following_count",
        "school.handle",
        "email",
      ])
      .filter({
        id: {
          $any: only_statuses.map((status) =>
            status.author_profile ? status.author_profile.id : ""
          ),
        },
      })
      .getAll();

    let images = await xata.db.image
      .filter({
        "status.id": {
          $any: only_statuses.map((status) => status.id),
        },
      })
      .getAll();

    let quoted_statuses = await xata.db.status
      .select([
        "id",
        "body",
        "like_count",
        "quote_count",
        "reply_count",
        "xata.createdAt",

        "author_profile.handle",
        "author_profile.name",
        "author_profile.profile_picture",
        "author_profile.bio",

        {
          name: "<-image.status",
          as: "images",
          columns: ["id", "alt", "file.*"],
        },
      ])
      .filter({
        id: {
          $any: only_statuses.map((status) =>
            status.quote_from ? status.quote_from.id : ""
          ),
        },
      })
      .getAll();

    let statuses = only_statuses.map((status) => ({
      ...status,
      author_profile: profiles.find(
        (profile) => profile.id === status.author_profile?.id
      ),
      quote_from: quoted_statuses.find(
        (quoted_status) => quoted_status.id === status.quote_from?.id
      ),
      images: {
        records: images.filter((image) => image?.status?.id === status.id),
      },
      xata: {
        createdAt: status.xata.createdAt,
      },
    }));

    return NextResponse.json(
      {
        status: "success",
        data: {
          statuses,
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
