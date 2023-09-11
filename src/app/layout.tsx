import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Inter } from "next/font/google";
import { ProvidersLayout } from "@/components/providers-layout";
import { cn } from "@/utils/cn";

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
    <html lang="es" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <div className="h-[100dvh] overflow-auto [scrollbar-gutter:stable] relative">
          <ProvidersLayout
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ProvidersLayout>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
