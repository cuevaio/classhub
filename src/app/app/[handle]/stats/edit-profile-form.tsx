"use client";

import React from "react";

import Compressor from "compressorjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImagePlusIcon } from "lucide-react";

import { useCurrentUser } from "@/utils/hooks/use-current-user";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/utils/hooks/use-debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export function UpdateProfileDialog() {
  const { profile, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  let { toast } = useToast();
  let [open, setOpen] = React.useState(false);
  let [name, setName] = React.useState<string>("");
  let [bio, setBio] = React.useState<string>("");

  const [debouncedHandle, handle, setHandle] = useDebounce<string>("", 300);

  let [image, setImage] = React.useState<{
    file: File;
    url: string;
  }>();

  let inputRef = React.useRef<HTMLInputElement>(null);

  let [errors, setErrors] = React.useState<{
    handle?: string;
  }>({});

  const [request, setRequest] = React.useState<AbortController | null>(null);

  let { mutate } = useMutation({
    mutationFn: async (form_data: FormData) =>
      fetch("/api/update-profile", {
        method: "POST",
        body: form_data,
      }),
    onSuccess: () => {
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      setOpen(false);
    },
  });

  React.useEffect(() => {
    if (request) {
      request.abort();
    }
    if (debouncedHandle === "") return;
    if (debouncedHandle === profile?.handle) return;
    if (handle === "") return;
    if (handle === profile?.handle) return;

    if (debouncedHandle !== handle) return;

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      let response = await fetch(`/api/check-handle?handle=${handle}`, {
        method: "GET",
        signal,
      });

      let data = await response.json();

      if (!response.ok) {
        let error_message = data.error || "Something went wrong";
        if (data.error === "INVALID_CHARACTERS") {
          error_message =
            "El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos";
        } else if (data.error === "INVALID_LENGTH") {
          error_message =
            "El nombre de usuario debe tener entre 3 y 24 caracteres";
        } else if (data.error === "INVALID_START_OR_END") {
          error_message =
            "El nombre de usuario no puede comenzar ni terminar con un punto, un guión o un guión bajo";
        } else if (data.error === "TAKEN") {
          error_message = "El nombre de usuario ya está en uso";
        }

        setErrors({
          handle: error_message,
        });
      } else {
        setErrors((errors) => ({
          ...errors,
          handle: undefined,
        }));
      }
    })();

    setRequest(controller);
  }, [debouncedHandle]);

  React.useEffect(() => {
    if (!isLoading) {
      setHandle(profile?.handle || "");
      setName(profile?.name || "");
      setBio(profile?.bio || "");
    }
  }, [isLoading]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    let files = event.target.files;
    if (!files) return;

    let file = files[0];
    new Compressor(file, {
      quality: 0.75,
      maxWidth: 1920,
      maxHeight: 1920,
      success: (result) => {
        let compressed_image = {
          file: result as File,
          url: URL.createObjectURL(result),
        };

        setImage(compressed_image);
      },
    });

    event.target.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let form_data = new FormData(event.currentTarget);
    image?.file && form_data.append("image", image.file);

    mutate(form_data);
  }

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar Perfil</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 sm:max-w-[425px]" onSubmit={handleSubmit}>
          <div className="w-16 h-16 sm:w-40 sm:h-40 relative rounded-full overflow-hidden mx-auto group">
            <Avatar className="h-full w-full z-0 absolute">
              <AvatarImage
                src={
                  image?.url ||
                  profile?.profile_picture?.url ||
                  "/images/default-profile.png"
                }
                alt={`@${profile.handle}`}
                className="object-cover"
              />
              <AvatarFallback>{profile.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="z-10 absolute w-full h-full bg-black/30 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center"
              onClick={() => {
                inputRef.current?.click();
              }}
            >
              <ImagePlusIcon className="w-4 h-4" />
            </button>
            <input
              ref={inputRef}
              id="picture"
              accept="image/png, image/jpeg, image/webp, image/avif"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-1">
              Nombre
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Nombre de usuario
            </Label>
            <Input
              id="handle"
              name="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="col-span-3"
            />
            {errors.handle && (
              <span className="col-span-4 text-gray-500 text-sm">
                {errors.handle}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-1">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
