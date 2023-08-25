"use client";
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery } from "react-query";
import { cn } from "@/utils/cn";
import { validateOptions, validateStatus } from "@/lib/validation/status";

interface Props extends React.HTMLAttributes<HTMLFormElement> {}

const CreateStatusForm = ({ className }: Props) => {
  const { isLoading, data } = useQuery("me", () =>
    fetch("/api/auth/me").then((res) => res.json())
  );

  let school = data?.profile?.school?.handle?.toUpperCase();
  let name = data?.profile?.name;

  let [author, setAuthor] = React.useState("user");
  let [audience, setAudience] = React.useState("everyone");

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let formData = new FormData(e.currentTarget);
    let status = formData.get("status") as string;

    let statusValidation = validateStatus(status);

    let optionsValidation = validateOptions({
      author,
      audience,
    });

    if (statusValidation === "VALID" && optionsValidation === "VALID") {
      fetch("/api/statuses", {
        method: "POST",
        body: JSON.stringify({
          status,
          author,
          audience,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(console.log)
        .catch(console.error);
    }
  }

  return (
    <form
      className={cn("grid grid-cols-1 gap-6", className)}
      onSubmit={onSubmitHandler}
    >
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor="status">Estado</Label>
        <Textarea
          id="status"
          autoFocus
          name="status"
          minLength={3}
          maxLength={280}
        />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Label>Autor</Label>
        <RadioGroup name="author" value={author} onValueChange={setAuthor}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user">{name || "Tú"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="anonymous" id="anonymous" />
            <Label htmlFor="anonymous">Anónimo</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor="audience">Audiencia</Label>
        <RadioGroup
          name="audience"
          value={audience}
          onValueChange={setAudience}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="everyone" id="everyone" />
            <Label htmlFor="everyone">Todos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="school" id="school" />
            <Label htmlFor="school">{school || "Escuela"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="circle"
              id="circle"
              disabled={author === "anonymous"}
            />
            <Label htmlFor="circle">Tu círculo social</Label>
          </div>
        </RadioGroup>
      </div>
      <Button type="submit">Crear</Button>
    </form>
  );
};

export { CreateStatusForm };
