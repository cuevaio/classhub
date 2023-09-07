"use client";
import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import Image from "next/image";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/utils/cn";
import { useCurrentUser } from "@/utils/hooks/use-current-user";

interface Props extends React.HTMLAttributes<HTMLFormElement> {}

import { NewStatusSchema } from "@/lib/form-schemas/new-status";
import { useRouter } from "next/navigation";
import { ImagePlusIcon } from "lucide-react";

const CreateStatusForm = ({ className }: Props) => {
  let inputRef = React.useRef<HTMLInputElement>(null);
  let { isLoading: isLoadingUser, profile } = useCurrentUser();
  const { toast } = useToast();
  let school = profile?.school?.handle?.toUpperCase();
  let name = profile?.name;

  let [images, setImages] = React.useState<
    {
      file: File;
      alt?: string;
      url: string;
    }[]
  >([]);

  let [author_option, setAuthorOption] = React.useState("user");
  let [audience_option, setAudienceOption] = React.useState("everyone");

  let router = useRouter();

  let { isLoading, isSuccess, mutate } = useMutation({
    mutationFn: async (form_data: FormData) => {
      let res = await fetch("/api/statuses", {
        method: "POST",
        body: form_data,
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
    form_data.append("author_option", author_option);
    form_data.append("audience_option", audience_option);

    let i = 0;
    for (let image of images) {
      form_data.append(`file-${i}`, image.file);
      form_data.append(`alt-${i}`, image.alt || "");
      i++;
    }

    let body = form_data.get("body") as string;

    let { success } = NewStatusSchema.safeParse({
      body,
      author_option,
      audience_option,
    });

    if (!success) {
      toast({
        description: "Hubo un error al crear el estado.",
        variant: "destructive",
      });
      return;
    }

    mutate(form_data);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let files = event.target.files;
    if (!files) return;

    let new_images = Array.from(files).map((file) => {
      return {
        file,
        url: URL.createObjectURL(file),
      };
    });

    setImages((prev) => [...prev, ...new_images]);

    event.target.value = "";
  };

  return (
    <form
      className={cn("grid grid-cols-1 gap-6", className)}
      onSubmit={onSubmitHandler}
    >
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor="body" className="sr-only">
          Estado
        </Label>
        <Textarea
          id="body"
          autoFocus
          name="body"
          minLength={1}
          maxLength={280}
          placeholder="¿Qué estás pensando?"
        />
        {images?.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.map((image) => (
              <AspectRatio ratio={16 / 9} key={image.url}>
                <Image
                  src={image.url}
                  alt="Image"
                  className="rounded-md object-cover"
                  fill
                />
              </AspectRatio>
            ))}
          </div>
        )}
        {images?.length < 3 && (
          <>
            <input
              ref={inputRef}
              id="picture"
              accept="image/png, image/jpeg, image/webp, image/avif"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              <ImagePlusIcon className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      <Separator className="my-0" />
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
