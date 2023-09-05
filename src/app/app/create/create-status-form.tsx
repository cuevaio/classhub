"use client";
import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/utils/cn";
import { useCurrentUser } from "@/utils/hooks/use-current-user";

interface Props extends React.HTMLAttributes<HTMLFormElement> {}
import {
  NewStatusSchema,
  type NewStatusType,
} from "@/lib/form-schemas/new-status";
import { useRouter } from "next/navigation";

const CreateStatusForm = ({ className }: Props) => {
  let { isLoading: isLoadingUser, profile } = useCurrentUser();
  const { toast } = useToast();
  let school = profile?.school?.handle?.toUpperCase();
  let name = profile?.name;

  let [author_option, setAuthorOption] = React.useState("user");
  let [audience_option, setAudienceOption] = React.useState("everyone");

  let router = useRouter();

  let { isLoading, isSuccess, mutate, data } = useMutation({
    mutationFn: async (new_status: NewStatusType) => {
      let res = await fetch("/api/statuses", {
        method: "POST",
        body: JSON.stringify(new_status),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("error trying to create status");

      let data: {
        id: string;
      } = await res.json();

      return data;
    },
    onSuccess: (data) => {
      let id = data.id.split("_")[1];
      toast({
        description: `Estado creado.`,
      });
      router.push(`/app/status/${id}`);
    },
  });

  function onSubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let form_data = new FormData(event.currentTarget);
    let body = form_data.get("status") as string;

    let data = NewStatusSchema.parse({
      body,
      author_option,
      audience_option,
    });

    mutate(data);
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
          minLength={1}
          maxLength={280}
          placeholder="¿Qué estás pensando?"
        />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Label>Autor</Label>
        <RadioGroup
          name="author_option"
          value={author_option}
          onValueChange={setAuthorOption}
        >
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
        <Label htmlFor="audience_option">Audiencia</Label>
        <RadioGroup
          name="audience_option"
          value={audience_option}
          onValueChange={setAudienceOption}
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
              disabled={author_option === "anonymous"}
            />
            <Label htmlFor="circle">Tu círculo social</Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        type="submit"
        disabled={
          isLoading ||
          isSuccess ||
          isLoadingUser ||
          (author_option === "anonymous" && audience_option === "circle")
        }
      >
        Crear
      </Button>
    </form>
  );
};

export { CreateStatusForm };
