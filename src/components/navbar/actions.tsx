import { Button } from "../ui/button";
import { ProfileActions } from "./profile-actions";
import Link from "next/link";
const NavbarActions = () => (
  <div className="flex space-x-2 justify-end items-center">
    <Button asChild size="sm">
      <Link href="/app/create">Publicar</Link>
    </Button>
    <ProfileActions />
  </div>
);

export { NavbarActions };
