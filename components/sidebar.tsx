"use client";

import Link from "next/link";
import { GraduationCap, Menu, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 md:hidden z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out bg-background border-r",
          "md:relative md:translate-x-0", // Mantém sidebar fixa no desktop
          "h-screen flex-shrink-0", // Garante altura da tela e não encolhe
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full flex-shrink-0">
          <div className="mb-2 mt-2 pb-4 border-b flex justify-center">
            <Image
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=542,fit=crop,q=95/m5Kb0gjDb4cqW1br/realizando-sonhos-logo-site-02-dWxbKV0z7VfNODJ9.png"
              alt="Associação Realizando Sonhos"
              width={300}
              height={100}
              priority
              className="h-auto"
            />
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
            {[
              {
                href: "/cadastro",
                label: "Cadastros",
                icon: FileText,
              },
              {
                href: "/alunos",
                label: "Alunos",
                icon: GraduationCap,
              },
              {
                href: "/turmas",
                label: "Turmas",
                icon: Users,
              },
              // Adicione mais aqui se quiser
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive(href)
                    ? "border font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-muted/40"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive(href) ? "scale-105" : "text-muted-foreground"
                  )}
                />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4">
            <div className="rounded-xl overflow-hidden border bg-white shadow-sm">
              <img
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/m5Kb0gjDb4cqW1br/istock-15193932232-dJo4azr9kZuJ9G8Q.jpg"
                alt="Associação Realizando Sonhos"
                className="w-full h-24 object-cover"
              />
              <div className="p-3 text-center space-y-1">
                <h2 className="text-sm font-semibold text-[#31A872]">
                  Associação
                </h2>
                <h3 className="text-base font-extrabold text-[#0061A8] leading-tight">
                  Realizando Sonhos
                </h3>
                <p className="text-xs text-gray-600">
                  Acreditamos que a educação transforma, tornando sonhos
                  realidade!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
