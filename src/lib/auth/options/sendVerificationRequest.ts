import { SignInEmail } from "@/components/signin-email";
import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { resend } from "@/lib/resend";
import { getXataClient } from "@/lib/xata";

const xata = getXataClient();

async function sendVerificationRequest({
  identifier,
  token,
}: SendVerificationRequestParams) {
  try {
    let email = identifier;
    let [username, domain] = email.split("@");

    let subdomains = domain.split(".");
    let isEdu = false;
    for (let i = 0; i < subdomains.length - 1; i++) {
      if (subdomains[i] === "edu") {
        isEdu = true;
        break;
      }
    }

    if (!isEdu) {
      throw new Error("Email must be an edu email");
    }

    let school = await xata.db.school
      .filter({
        domain,
      })
      .getFirst();

    if (school) {
      school.update({ student_count: { $increment: 1 } });
    } else {
      await xata.db.school.create({
        domain,
        name: domain,
        handle: domain,
        student_count: 1,
      });
    }

    await resend.emails.send({
      from: "ClassHub <signin@updates.fitpeak.shop>",
      to: [identifier],
      subject: "Link de inicio de sesión para ClassHub",
      text: "Ingresa a este link para iniciar sesión en ClassHub",
      react: SignInEmail({ verificationCode: token, email: identifier }),
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error(`Email could not be sent. Something went wrong.`);
  }
}

export { sendVerificationRequest };
