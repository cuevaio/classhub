"use client";
import { VerifyForm } from "./verify-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { status } = useSession();

  let token = searchParams.get("token");
  let email = searchParams.get("email");

  if (status === "authenticated") {
    router.push("/app");
    return null;
  }

  if (status === "loading") {
    return "loading";
  }

  if (!email && status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (email && status === "unauthenticated") {
    return (
      <div className="w-[350px] flex flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Verificar correo
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa el código que te enviamos a {email}
          </p>
        </div>
        <VerifyForm initialOtp={token || undefined} email={email} />{" "}
        <p className="px-8 text-center text-sm text-muted-foreground text-balance">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    );
  }
};

export default VerifyPage;
