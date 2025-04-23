import type React from "react";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { CadastroProvider } from "@/lib/context";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import { Sidebar } from "@/components/sidebar";
const inter = Poppins({ weight: ["400", "600", "800"], subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
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
