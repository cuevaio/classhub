"use server";

import { Matrix } from "ml-matrix";

import { getMyProfileOrThrow } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";
const xata = getXataClient();
async function likeStatus(status_id: string) {
  try {
    let status = await xata.db.status.readOrThrow(status_id);

    if (!status.embedding) {
      throw Error("Invalid status");
    }

    let profile = await getMyProfileOrThrow();

    let rel_profile_status = await xata.db.rel_profile_status
      .filter({
        "profile.id": profile.id,
        "status.id": status.id,
      })
      .getFirst();

    if (!rel_profile_status) {
      rel_profile_status = await xata.db.rel_profile_status.create({
        profile: profile.id,
        status: status.id,
        like: true,
      });
    } else {
      rel_profile_status = await rel_profile_status.update({
        like: !rel_profile_status.like,
      });
    }

    console.log(rel_profile_status);

    if (!profile.embedding) {
      const status_matrix = Matrix.columnVector(status.embedding);
      const profile_updated_matrix = status_matrix.mul(0.05);

      await profile.update({
        embedding: profile_updated_matrix.getColumn(0),
      });
    } else {
      if (rel_profile_status?.like) {
        const profile_original_matrix = Matrix.columnVector(profile.embedding);
        const status_matrix = Matrix.columnVector(status.embedding);
        const profile_updated_matrix = profile_original_matrix
          .mul(0.95)
          .add(status_matrix.mul(0.05));

        await profile.update({
          embedding: profile_updated_matrix.getColumn(0),
        });
      } else {
        const profile_mutated_matrix = Matrix.columnVector(profile.embedding);
        const status_matrix = Matrix.columnVector(status.embedding);
        const profile_unmutated_matrix = profile_mutated_matrix
          .sub(status_matrix.mul(0.05))
          .div(0.95);

        await profile.update({
          embedding: profile_unmutated_matrix.getColumn(0),
        });
      }
    }
    // @ts-ignore
    status.update({
      like_count: {
        $increment: rel_profile_status?.like ? 1 : -1,
      },
    });

    console.log(status);

    // if (status.author_profile?.id) {
    //   // @ts-ignore
    //   await xata.db.profile.update(status.author_profile.id, {
    //     "stats.like_count": {
    //       $increment: rel_profile_status?.like ? 1 : -1,
    //     },
    //   });
    // }
  } catch (error) {
    console.log(error);
  }
}

export { likeStatus };
