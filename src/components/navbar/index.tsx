import Link from "next/link";
import { Search } from "./search";

const Navbar = () => {
  return (
    <div className="container h-16 grid grid-cols-3 gap-4 items-center top-0 sticky bg-background z-10 border-b border-b-muted/40 mb-4">
      <Link href="/app" className="text-2xl w-max">
        <span className="font-bold text-primary">class</span>
        <span className="font-bold text-primary-foreground" >hub</span>
      </Link>

      <Search />
    </div>
  );
};

export { Navbar };
