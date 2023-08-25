"use client";
import * as React from "react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { handleSubmit } from "./handle-submit";
import { useRouter } from "next/navigation";

export function SignInForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { toast } = useToast();
  const router = useRouter();

  const [sending, setSending] = React.useState(false);

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, toast, router, setSending);
        }}
      >
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              placeholder="anthony.cueva@utec.edu.pe"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
            />
          </div>
          <Button type="submit" disabled={sending}>
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}
