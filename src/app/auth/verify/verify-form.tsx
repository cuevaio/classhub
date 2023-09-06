"use client";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { allowedCharacters } from "@/lib/auth/options/allowedCharacters";

interface VerifyFormProps extends React.HTMLAttributes<HTMLDivElement> {
  initialOtp?: string;
  email: string;
}

const VerifyForm = ({
  initialOtp,
  email,
  className,
  ...props
}: VerifyFormProps) => {
  let { toast } = useToast();
  let router = useRouter();

  let [otp, setOtp] = React.useState<string[]>(new Array(6).fill(""));
  let divRef = React.useRef<HTMLDivElement>(null);
  let buttonRef = React.useRef<HTMLButtonElement>(null);

  let [verifying, setVerifying] = React.useState(false);

  let otpString = otp.join("");

  let validOtp = otpString.length === 6;

  React.useEffect(() => {
    if (divRef.current) {
      if (initialOtp?.length === 6) {
        setOtp(initialOtp.toLocaleUpperCase().split(""));

        if (buttonRef.current) {
          buttonRef.current.disabled = false;
          buttonRef.current.focus();
        }
      } else {
        let firstInput = divRef.current.querySelector(
          "input"
        ) as HTMLInputElement;

        firstInput.focus();
      }
    }
  }, [initialOtp]);

  function onPasteHandler(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    let clipboardData = event.clipboardData;
    let pastedData = clipboardData?.getData("text/plain");

    if (pastedData.length === 6) {
      let otpArray = pastedData.toLocaleUpperCase().split("");
      setOtp(otpArray);
      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.focus();
      }
    }
  }

  function onChangeHandler(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    let target = event.target;
    let nextSibling = target.nextSibling as HTMLInputElement;
    let previousSibling = target.previousSibling as HTMLInputElement;

    let value = target.value;

    if (value.length === 6) {
      let otpArray = value.toLocaleUpperCase().split("");
      setOtp(otpArray);

      if (buttonRef.current) {
        buttonRef.current.disabled = false;
        buttonRef.current.focus();
      }
    } else {
      value = value.charAt(value.length - 1).toLocaleUpperCase();

      if (allowedCharacters.includes(value)) {
        setOtp([...otp.map((d, _index) => (index === _index ? value : d))]);
      }

      if (nextSibling && allowedCharacters.includes(value) && value !== "") {
        nextSibling.focus();
      } else if (previousSibling && value === "") {
        previousSibling.focus();
      }
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setVerifying(true);
    if (validOtp) {
      let searchParams = new URLSearchParams({
        email,
        token: otpString,
      });
      try {
        const res = await fetch("/api/auth/callback/email?" + searchParams);

        if (res.status === 403) {
          toast({
            variant: "destructive",
            title: "Código ya utilizado",
            description:
              "El código ya fue utilizado, por favor solicita uno nuevo",
          });
          router.push("/auth/signin");
        } else {
          router.push("/auth/register");
        }
      } catch (error) {
        console.error(error);
        router.push("/auth/signin");
      }
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid grid-cols-6 gap-2" ref={divRef}>
            {otp.map((value, index) => (
              <Input
                className="text-center"
                type="text"
                key={index}
                value={value}
                autoCapitalize="characters"
                onChange={(event) => onChangeHandler(event, index)}
                onPaste={onPasteHandler}
                onFocus={(event) => {
                  setTimeout(() => {
                    event.target.selectionStart = 10000;
                    event.target.selectionEnd = 10000;
                  }, 0);
                }}
              />
            ))}
          </div>
          <Button
            type="submit"
            ref={buttonRef}
            disabled={verifying || !validOtp}
          >
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};

export { VerifyForm };
