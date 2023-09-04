import { Navbar } from "@/components/navbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AppLayout
