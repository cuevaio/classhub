import { Navbar } from "@/components/navbar";
import { Separator } from "@/components/ui/separator";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="top-0 sticky bg-background z-10">
        <Navbar />
        <Separator className="mb-3 bg-muted/80" />
      </div>
      <div className="pb-16">{children}</div>
    </>
  );
};

export default AppLayout;
