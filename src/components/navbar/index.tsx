import Link from "next/link";
import { Search } from "./search";
import { NavbarActions } from "./actions";

const Navbar = () => {
  return (
    <div className="container h-16 flex sm:grid grid-cols-3 gap-4 items-center top-0 sticky bg-background z-10 border-b border-b-muted/40 mb-4">
      <Link href="/app" className="text-2xl w-max min-w-[56px] flex-none">
        <span className="font-bold text-primary hidden sm:inline-block">class</span>
        <span className="font-bold hidden sm:inline-block">hub</span>
        <span className="font-bold text-primary inline-block sm:hidden">c</span>
        <span className="font-bold inline-block sm:hidden">h</span>
      </Link>

      <Search />

      <NavbarActions />
    </div>
  );
};

export { Navbar };
