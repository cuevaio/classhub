import { ImageRecord } from "@/lib/xata";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

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
    );
  }

  if (validImages.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
        {validImages.map(({ file, alt, id }) => (
          <AspectRatio ratio={3 / 4} key={id}>
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
        ))}
      </div>
    );
  }

  if (validImages.length === 3) {
    return (
      <div className="grid grid-rows-2 grid-cols-2 gap-4 w-full max-w-lg h-96">
        {validImages.map(({ file, alt, id }, index) => (
          <div className="first:row-span-2" key={id}>
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
        ))}
      </div>
    );
  }
};

export { Images };
