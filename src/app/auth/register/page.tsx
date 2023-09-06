"use client";
import { RegisterForm } from "./register-form";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function RegisterPage() {
  let { isLoading, data } = useQuery({
    queryKey: ["complete"],
    queryFn: async () => {
      let res = await fetch("/api/auth/complete");
      if (!res.ok) throw new Error("Seems like you are not logged in");
      return (await res.json()) as {
        complete: boolean;
      };
    },
  });

  const router = useRouter();

  if (!isLoading && data?.complete) {
    router.push("/app");
  }

  if (isLoading) {
    return <div>loading</div>;
  }

  if (!isLoading && data?.complete === false) {
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
