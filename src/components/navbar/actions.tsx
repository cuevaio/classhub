import Link from "next/link";

import { Button } from "../ui/button";
import { ProfileActions } from "./profile-actions";
import { ThemeToggle } from "./theme-toggler";

const NavbarActions = () => (
  <div className="sm:col-span-2 flex space-x-2 justify-end items-center">
    <Button asChild size="sm" className="hidden sm:inline-flex">
      <Link href="/app/create">Publicar</Link>
    </Button>
    <ThemeToggle />
    <ProfileActions />
  </div>
);

export { NavbarActions };
