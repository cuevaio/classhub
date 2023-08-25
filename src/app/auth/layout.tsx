import { cn } from "@/utils/cn";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="md:grid md:grid-cols-2 h-screen">
    <div className="hidden md:block relative overflow-hidden">
      <Image
        src="/images/pexels-sign-in-picture.jpg"
        width={1920}
        height={1280}
        alt="Authentication"
        className="object-cover h-full -z-10"
      />
      <div className="absolute top-10 left-10 z-20 flex items-center text-lg font-medium text-background">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        ClassHub
      </div>

      <blockquote className="space-y-2 absolute bottom-0 left-0 z-20 bg-background/50 p-10">
        <p className="text-lg">
          Classhub es la red social EXCLUSIVA para ti. Conecta con miles de
          estudiantes alrededor del mundo. 100% seguro, gratis y sin anuncios.
        </p>
      </blockquote>
    </div>
    <div className="relative w-full h-full flex items-center justify-center">
      <Link
        href="/about"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        WTF is this?
      </Link>

      {children}
    </div>
  </div>
);

export default Layout;
