"use client";
import { RegisterForm } from "./register-form";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/utils/hooks/use-current-user";

export default function RegisterPage() {
  let { isLoading, profile } = useCurrentUser();

  const router = useRouter();

  if (!isLoading && profile?.handle) {
    router.push("/app");
  }

  if (isLoading) {
    return <div>loading</div>;
  }

  if (isLoading && profile === null) {
    return (
      <div className="w-[350px] flex flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Registro</h1>
          <p className="text-sm text-muted-foreground">
            Crea una cuenta para empezar a usar classhub
          </p>
        </div>
        <RegisterForm />
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
