import type React from "react";
import "./globals.css";
import { CadastroProvider } from "@/lib/context";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
const font = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={font.className}>
        <CadastroProvider>
          {children}
          <Toaster />
        </CadastroProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
