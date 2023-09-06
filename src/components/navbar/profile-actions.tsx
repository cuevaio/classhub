"use client";

import { useCurrentUser } from "@/utils/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import * as React from "react";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";

const ProfileActions = () => {
  let { isLoading, profile } = useCurrentUser();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const logoutShorcut = (e: KeyboardEvent) => {
      if (e.key === "Q" && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        signOut({ callbackUrl: "/" });
      }
    };

    document.addEventListener("keydown", logoutShorcut);
    return () => document.removeEventListener("keydown", logoutShorcut);
  }, []);

  if (isLoading || !profile?.name)
    return <Skeleton className="w-12 h-12 rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>{profile.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm leading-none">{profile.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              @{profile.handle}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/app/${profile.handle}`}>Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/app/create">Publicar</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Tema</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Oscuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Claro
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ProfileActions };
