import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { People } from "./people";

const AppLayout = ({
  children,
  people,
}: {
  children: React.ReactNode;
  people: React.ReactNode;
}) => {
  return (
    <>
      <div className="top-0 sticky bg-background z-10">
        <Navbar />
        <Separator className="mb-3 bg-muted/80" />
      </div>
      <div className="container pb-16 flex gap-4">
        <div className="grow">{children}</div>
        <People />
      </div>
    </>
  );
};

export default AppLayout;
