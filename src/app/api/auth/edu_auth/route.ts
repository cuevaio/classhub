import { checkIsEduEmail } from "@/utils/checkIsEduEmail";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (typeof email !== "string") {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    let isEdu = checkIsEduEmail(email);

    if (!isEdu) {
      return NextResponse.json(
        {
          error: "Email must be an edu email",
        },
        {
          status: 400,
        }
      );
    }

    let baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    let csrfTokenRes = await fetch(`${baseUrl}/api/auth/csrf`);
    let { csrfToken } = (await csrfTokenRes.json()) as {
      csrfToken: string;
    };

    let searchParams = new URLSearchParams({
      email,
      csrfToken,
      json: "true",
    });

    let signInRes = await fetch(
      `${baseUrl}/api/auth/signin/email?${searchParams}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams,
      }
    );

    if (signInRes.ok) {
      return NextResponse.json(
        {
          message: "Email sent",
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
