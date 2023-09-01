"use client";
import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { checkIsValidHandle } from "@/utils/check-is-valid-handle";
import { useRouter } from "next/navigation";

const months = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  let [submitting, setSubmitting] = React.useState(false);
  let router = useRouter();
  let [year, setYear] = React.useState(2001);
  let [month, setMonth] = React.useState(10);
  let [day, setDay] = React.useState(30);

  let bod = new Date(year, month, day);
  let now = new Date();

  let age = new Date(now.getTime() - bod.getTime()).getFullYear() - 1970;

  function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);

    let data = new FormData(event.currentTarget);
    let name = data.get("name") as string;
    let handle = data.get("handle") as string;

    let valid = checkIsValidHandle(handle);

    if (valid === "VALID") {
      fetch("/api/check-handle?handle=" + handle).then((res) => {
        if (res.status === 200) {
          toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">
                  {JSON.stringify(
                    {
                      name,
                      handle,
                      bod: format(bod, "PPP", { locale: es }),
                    },
                    null,
                    2
                  )}
                </code>
              </pre>
            ),
          });
        } else {
          toast({
            title: "Nombre de usuario no disponible",
            description: "El nombre de usuario ya está en uso",
            variant: "destructive",
          });
        }
      });

      fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          handle,
          bod: `${year}-${month}-${day}`,
        }),
      }).then((res) => {
        if (res.status === 200) {
          toast({
            title: "Registro exitoso",
            description: "Hola, " + name + "! Ya puedes usar tu cuenta",
          });

          router.push("/app");
        } else {
          toast({
            title: "Error",
            description: "Hubo un error al registrarte",
            variant: "destructive",
          });
          setSubmitting(false);
        }
      });
    } else {
      if (valid === "INVALID_CHARACTERS") {
        toast({
          title: "Nombre de usuario inválido",
          description:
            "El nombre de usuario solo puede contener letras, números y guiones bajos",
          variant: "destructive",
        });
      } else if (valid === "INVALID_LENGTH") {
        toast({
          title: "Nombre de usuario inválido",
          description:
            "El nombre de usuario debe tener entre 3 y 18 caracteres",
          variant: "destructive",
        });
      } else if (valid === "INVALID_START_OR_END") {
        toast({
          title: "Nombre de usuario inválido",
          description:
            "El nombre de usuario no puede comenzar ni terminar con un guión bajo",
          variant: "destructive",
        });
      }

      setSubmitting(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmitHandler}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              name="name"
              id="name"
              placeholder="Anthony Cueva"
              autoComplete="name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="handle">Handle (@)</Label>
            <Input
              name="handle"
              id="handle"
              placeholder="cuevantn"
              autoComplete="username"
              autoCapitalize="none"
              required
              minLength={3}
              maxLength={24}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bod">Fecha de nacimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="bod"
                  name="bod"
                  variant={"outline"}
                  className={cn("pl-3 text-right font-normal")}
                >
                  {format(bod, "PPP", { locale: es })} ({age} años)
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex w-auto flex-col space-y-2 p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    onValueChange={(value) => {
                      setYear(Number(value));
                    }}
                    value={String(year)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Array.from({ length: 11 }, (_, i) => (
                        <SelectItem key={i} value={String(2023 - 15 - i)}>
                          {2023 - 15 - i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => {
                      setMonth(Number(value));
                    }}
                    value={String(month)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={String(i)}>
                          {months[i]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={bod}
                    onSelect={(date) => {
                      if (!date) return;
                      setDay(date.getDate());
                      setMonth(date.getMonth());
                      setYear(date.getFullYear());
                    }}
                    fromDate={new Date("1998-01-01")}
                    toDate={new Date("2008-12-31")}
                    locale={es}
                    onMonthChange={(date) => {
                      setMonth(date.getMonth());
                      setYear(date.getFullYear());
                    }}
                    month={bod}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" disabled={submitting}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
