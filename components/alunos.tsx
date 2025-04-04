"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileBarChart,
  MoreHorizontal,
  PlusIcon,
  Search,
  SunMediumIcon,
  Sunrise,
  Sunset,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Student, useCadastro } from "@/lib/context";
import { Sidebar } from "@/components/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OctagonAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AlunosPage() {
  const { addStudent, students } = useCadastro();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const [isInfosModalOpen, setIsInfosModalOpen] = useState(false);
  const [infosModalData, setInfosModalData] = useState<Student>();

  const handleCloseInfosModal = () => setIsInfosModalOpen(!isInfosModalOpen);
  const handleInfosModal = (_parameter: Student) => {
    const student = students.find(
      (student) => _parameter.name === student.name
    );

    setInfosModalData(student);
    setIsInfosModalOpen(true);
  };

  useEffect(() => {
    setFilteredStudents(students);
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, students]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <AlertDialog open={isInfosModalOpen} onOpenChange={setIsInfosModalOpen}>
          <AlertDialogContent className="max-w-md sm:max-w-lg">
            <AlertDialogHeader>
              <div className="flex flex-col items-center sm:items-start">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <OctagonAlert className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <AlertDialogTitle className="text-center sm:text-left text-lg font-semibold">
                  Informações do Aluno
                </AlertDialogTitle>
              </div>
            </AlertDialogHeader>

            <Separator className="border-t border-dashed" />

            {infosModalData ? (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-medium">Nome:</p>
                  <p className="text-muted-foreground">{infosModalData.name}</p>

                  <p className="font-medium">Data de Nascimento:</p>
                  <p className="text-muted-foreground">
                    {infosModalData.birthDate}
                  </p>

                  <p className="font-medium">Responsável:</p>
                  <p className="text-muted-foreground">
                    {infosModalData.guardian}
                  </p>

                  <p className="font-medium">Contato:</p>
                  <p className="text-muted-foreground">
                    {infosModalData.guardianPhoneNumber}
                  </p>

                  <p className="font-medium">CPF do Responsável:</p>
                  <p className="text-muted-foreground">
                    {infosModalData.guardianCPF}
                  </p>
                </div>

                <Separator className="border-t border-dashed" />

                <div>
                  <p className="font-medium">Informações adicionais:</p>
                  <p className="text-muted-foreground">
                    {infosModalData.additionalInfos ??
                      "Nenhuma informação adicional"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center">
                Nenhum estudante selecionado.
              </p>
            )}

            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setIsInfosModalOpen(false)}>
                Fechar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-8">
          <div className="flex items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Alunos</h2>
              <p className="text-muted-foreground">
                Listagem de todos os alunos cadastrados no sistema
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                className="bg-[#056bbd] hover:bg-[#056bbd]/80 text-white py-2 px-4 rounded"
              >
                <Link href="/cadastro?tipo=aluno">Cadastrar Novo Aluno</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.schoolYear}</Badge>
                      </TableCell>
                      <TableCell>{student.guardian}</TableCell>
                      <TableCell>
                        <Badge
                          className={`flex items-center justify-center shadow-none rounded-full ${
                            student.shift === "MANHÃ"
                              ? "bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60"
                              : "bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60"
                          }`}
                        >
                          {student.shift === "TARDE" ? (
                            <Sunset className="w-4 h-4 mr-1" />
                          ) : (
                            <SunMediumIcon className="w-4 h-4 mr-1" />
                          )}
                          {student.shift}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleInfosModal(student)}
                            >
                              Ver detalhes
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchTerm
                        ? "Nenhum resultado encontrado."
                        : "Nenhum aluno cadastrado."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
// green color: #13b387, yellow color: #faa441 and blue color: #056bbd
