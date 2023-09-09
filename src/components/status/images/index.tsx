import Image from "next/image";

import { ImageRecord } from "@/lib/xata";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageDialog } from "./dialog";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  images: ImageRecord[];
}

const Images = ({ images, className, ...props }: Props) => {
  let validImages = images.filter((image) => !!image.file);

  if (validImages.length === 0) {
    return null;
  }

  if (validImages.length === 1) {
    return (
      <ImageDialog images={validImages} initialId={validImages[0].id}>
        <div className="w-full max-w-lg">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={
                // @ts-ignore
                validImages[0].file.url ||
                // @ts-ignore
                `https://us-east-1.storage.xata.sh/${validImages[0].file.storageKey}`
              }
              alt="Image"
              className="rounded-lg object-cover"
              fill
            />
          </AspectRatio>
        </div>
      </ImageDialog>
    );
  }

  if (validImages.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full sm:min-w-[30rem] max-w-xl">
        {validImages.map(({ file, alt, id }, index) => (
          <ImageDialog images={validImages} initialId={id} key={id}>
            <AspectRatio ratio={3 / 4}>
              <Image
                src={
                  // @ts-ignore
                  file.url ||
                  // @ts-ignore
                  `https://us-east-1.storage.xata.sh/${file.storageKey}`
                }
                alt="Image"
                className="rounded-lg object-cover"
                fill
              />
            </AspectRatio>
          </ImageDialog>
        ))}
      </div>
    );
  }

  if (validImages.length === 3) {
    return (
      <div className="grid grid-rows-2 grid-cols-2 gap-4 aspect-video max-w-lg">
        {validImages.map(({ file, alt, id }, index) => (
          <ImageDialog images={validImages} initialId={id} key={id}>
            <div className="first:row-span-2" id={index.toString()}>
              <Image
                src={
                  // @ts-ignore
                  file.url ||
                  // @ts-ignore
                  `https://us-east-1.storage.xata.sh/${file.storageKey}`
                }
                alt="Image"
                className="rounded-lg object-cover h-full w-full"
                width={500}
                height={500}
              />
            </div>
          </ImageDialog>
        ))}
      </div>
    );
  }
};

export { Images };
