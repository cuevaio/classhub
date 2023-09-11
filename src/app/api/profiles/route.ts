import { type NextRequest, NextResponse } from "next/server";
import { getXataClient } from "@/lib/xata";
import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { Matrix } from "ml-matrix";

let xata = getXataClient();

let weights = [
  10, // like_count
  15, // follower_count
  5, // following_count
];

let weightsRow = Matrix.columnVector(weights);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let page = parseInt(searchParams.get("page") || "0");
    let profile = await getMyProfileOrThrow();

    if (!profile.embedding) {
      return NextResponse.json(
        {
          status: "error",
          error: "You need to set your embedding first",
        },
        {
          status: 400,
        }
      );
    }

    let results = await xata.db.profile.vectorSearch(
      "embedding",
      profile.embedding,
      {
        size: 100,
        filter: {
          id: {
            $isNot: profile.id,
          },
        },
      }
    );

    let profiles_with_scores = results.map((profile) => {
      let profile_feautures = [
        profile.like_count, // like_count
        profile.follower_count, // follower_count
        profile.following_count, // following_count
      ];

      let profile_matrix = Matrix.rowVector(profile_feautures);

      let score = profile_matrix.mmul(weightsRow).get(0, 0);

      return {
        ...profile,
        score,
      };
    });

    let profile_pictures = await xata.db.profile
      .filter({
        id: {
          $any: profiles_with_scores.map((profile) => profile.id),
        },
      })
      .select(["id", "profile_picture.*"])
      .getAll();

    let only_profiles = profiles_with_scores
      .sort((a, b) => b.score - a.score)
      .slice(page * 10, page * 10 + 10);

    let schools = await xata.db.school
      .select(["id", "name", "handle"])
      .filter({
        id: {
          $any: only_profiles.map((profile) =>
            profile.school ? profile.school.id : ""
          ),
        },
      })
      .getAll();

    let profiles = only_profiles.map((profile) => ({
      ...profile,
      embedding: undefined,
      school: schools.find((school) => school.id === profile.school?.id),
      profile_picture: profile_pictures.find(
        (profile_picture) => profile_picture.id === profile.id
      )?.profile_picture,
    }));

    let has_more = profiles.length === 10;

    return NextResponse.json(
      {
        status: "success",
        data: {
          profiles,
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
