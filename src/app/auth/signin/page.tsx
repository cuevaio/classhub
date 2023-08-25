"use client";

import Link from "next/link";

import { SignInForm } from "./sign-in-form";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthenticationPage() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.push("/app");
  }

  if (status === "loading") {
    return "loading";
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-[350px] flex flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu correo para recibir un link de acceso
          </p>
        </div>
        <SignInForm className="w-full" />
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
}
