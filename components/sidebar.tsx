"use client";

import Link from "next/link";
import {
  Book,
  GraduationCap,
  Home,
  Menu,
  Users,
  FileText,
  FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";

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
          "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out bg-background border-r md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <img
              src="https://storage.googleapis.com/atados-v3/user-uploaded/images/7bcb9e4f-0e4d-424e-8142-8254cbc603f2.png"
              alt="Logo Realizando Sonhos"
              className="rounded-full object-cover"
            />
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/cadastro"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-muted",
                isActive("/cadastro") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <FileText className="mr-2 h-5 w-5" />
              Cadastros
            </Link>
            <Link
              href="/alunos"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-muted",
                isActive("/alunos") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Alunos
            </Link>
            <Link
              href="/turmas"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-muted",
                isActive("/turmas") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Users className="mr-2 h-5 w-5" />
              Turmas
            </Link>
            {/* <Link
              href="/relatorios"
              className={cn(
                "flex items-center p-2 rounded-md hover:bg-muted",
                isActive("/relatorios")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <FileBarChart className="mr-2 h-5 w-5" />
              Relatórios
            </Link> */}
          </nav>
        </div>
      </div>
    </>
  );
}
