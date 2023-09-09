"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { ImageRecord } from "@/lib/xata";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ImageDialog({
  children,
  images,
  initialId,
  ...props
}: {
  children: React.ReactNode;
  images: ImageRecord[];
  initialId: string;
  props?: any;
}) {
  let [index, setIndex] = React.useState(0);
  let prevImageButtonRef = React.useRef<HTMLButtonElement>(null);
  let nextImageButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    let initialIndex = images.findIndex((image) => image.id === initialId);
    setIndex(initialIndex);
  }, [initialId]);

  React.useEffect(() => {
    let handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((index - 1 + images.length) % images.length);
        prevImageButtonRef.current?.focus();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIndex((index + 1) % images.length);
        nextImageButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [index]);

  return (
    <Dialog>
      <DialogTrigger asChild className="hover:cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <Image
          src={
            // @ts-ignore
            images[index].file.url ||
            // @ts-ignore
            `https://us-east-1.storage.xata.sh/${images[index].file.storageKey}`
          }
          alt="Image"
          className="rounded-lg h-full"
          width={1920}
          height={1080}
        />
        {images.length > 1 && (
          <>
            <Button
              ref={prevImageButtonRef}
              variant="outline"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 ml-8"
              onClick={() =>
                setIndex((index - 1 + images.length) % images.length)
              }
              size="icon"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              ref={nextImageButtonRef}
              variant="outline"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 mr-8"
              onClick={() => setIndex((index + 1) % images.length)}
              size="icon"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
