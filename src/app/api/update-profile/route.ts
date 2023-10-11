import { getMyProfile } from "@/lib/auth/get-my-profile";
import { getXataClient } from "@/lib/xata";
import { checkIsValidHandle } from "@/utils/check-is-valid-handle";
import { NextRequest, NextResponse } from "next/server";

let xata = getXataClient();

export async function POST(request: NextRequest) {
  try {
    let profile = await getMyProfile();

    if (!profile) {
      return NextResponse.json(
        {
          error: "Not logged in",
        },
        {
          status: 401,
        }
      );
    }

    let form_data = await request.formData();
    let name = String(form_data.get("name"));
    let handle = String(form_data.get("handle"));
    let bio = String(form_data.get("bio"));

    if (name.length < 3 || name.length > 30) {
      return NextResponse.json(
        {
          error: "INVALID_NAME",
        },
        {
          status: 400,
        }
      );
    }

    let handle_status = checkIsValidHandle(handle);

    if (handle_status !== "VALID") {
      return NextResponse.json(
        {
          error: handle_status,
        },
        {
          status: 400,
        }
      );
    }

    let image = form_data.get("image");

    if (image) {
      let file = image as File;
      let fileName: string = file.name;
      let mimeType = file.type;
      let fileData = Buffer.from(await file.arrayBuffer());

      await xata.db.profile.update(profile.id, {
        name,
        handle,
        bio,
        profile_picture: {
          name: fileName,
          mediaType: mimeType,
          base64Content: fileData.toString("base64"),
        },
      });
    } else {
      await xata.db.profile.update(profile.id, {
        name,
        handle,
        bio,
      });
    }
    return NextResponse.json({
      success: true,
    });
  } catch (e) {
    console.error(e);
    // @ts-ignore
    return NextResponse.error(e);
  }
}
