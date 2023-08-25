import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Inter } from "next/font/google";
import { ProviderLayout } from "@/components/provider-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Classhub",
  description: "La red social EXCLUSIVA de los estudiantes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={inter.className}>
        <ProviderLayout>{children}</ProviderLayout>
        <Toaster />
      </body>
    </html>
  );
}
