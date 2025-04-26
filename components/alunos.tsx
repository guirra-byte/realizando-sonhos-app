"use client";

import { useEffect, useState } from "react";
import {
  Download,
  Moon,
  MoreHorizontal,
  Sun,
  Trash2,
  Users,
  X,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User } from "next-auth";
import { isSameMonth } from "date-fns";
import Confetti from "react-confetti-boom";
import { Checkbox } from "./ui/checkbox";

const shiftSelectAssign: Record<string, string> = {
  morning: "MANHÃ",
  afternoon: "TARDE",
};

type UserProps = {
  user?: User;
};
export default function AlunosPage({ user }: UserProps) {
  const { addStudent, students } = useCadastro();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchShift, setSearchShift] = useState("both");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [monthlyBirthdays, setMonthBirthdays] = useState<Student[]>([]);

  const [isInfosModalOpen, setIsInfosModalOpen] = useState(false);
  const [infosModalData, setInfosModalData] = useState<Student>();

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
    let filterByBirthdayDate = students.filter((student) =>
      isSameMonth(student.birthDate, new Date())
    );

    setMonthBirthdays(filterByBirthdayDate);

    let termsFilter = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (searchShift && shiftSelectAssign[searchShift]) {
      termsFilter = termsFilter.filter(
        (student) => student.shift === shiftSelectAssign[searchShift]
      );
    }

    setFilteredStudents(termsFilter);
  }, [searchTerm, students, searchShift]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* Main content */}
          <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
            <AlertDialog
              open={isInfosModalOpen}
              onOpenChange={setIsInfosModalOpen}
            >
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
                      <p className="text-muted-foreground">
                        {infosModalData.name}
                      </p>

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
                  <h2 className="text-3xl font-bold tracking-tight text-[#056bbd]">
                    Alunos
                  </h2>
                  <p className="text-muted-foreground">
                    Listagem de todos os alunos cadastrados no sistema
                  </p>
                </div>
              </div>

              <div className="container mx-auto">
                <div className="grid gap-4">
                  {/* Total Students Card */}
                  <Card className="overflow-hidden hover:border-gray-300 transition-colors border-t-0 border-grad relative">
                    <div className="h-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500"></div>

                    <CardHeader className="pb-2 relative">
                      {/* Container para limitar o confetti */}
                      {monthlyBirthdays.length > 0 && (
                        <div className="absolute inset-0 pointer-events-none z-0">
                          <Confetti
                            mode="fall"
                            particleCount={70}
                            fadeOutHeight={10}
                            colors={["#f59e0b", "#ec4899", "#8b5cf6"]}
                          />
                        </div>
                      )}

                      <div className="relative z-10 flex justify-between items-center">
                        <CardTitle className="text-base font-medium text-gray-700">
                          <h2 className="text-2xl font-semibold mb-4 flex items-center">
                            <span className="mr-2 text-3xl">🎂</span>
                            Aniversariantes do Mês
                          </h2>
                        </CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Tabela dos aniversariantes */}
                      <div className="rounded-lg border">
                        <Table className="text-sm [&_td]:py-2 [&_th]:py-1">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Aniversariante</TableHead>
                              <TableHead>Série</TableHead>
                              <TableHead>Responsável</TableHead>
                              <TableHead>Turno</TableHead>
                              <TableHead>Data do Aniversário</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {monthlyBirthdays.length > 0 ? (
                              monthlyBirthdays.map((student, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <Badge className="bg-yellow-500/10 dark:bg-yellow-500/20 hover:bg-yellow-500/10 text-yellow-500 border-yellow-500/60 shadow-none rounded-full">
                                      <span className="mr-2">🎉</span>
                                      {student.name}
                                    </Badge>
                                  </TableCell>

                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="rounded-lg"
                                    >
                                      {student.schoolYear}
                                    </Badge>
                                  </TableCell>

                                  <TableCell>{student.guardian}</TableCell>

                                  <TableCell>
                                    {student.shift === "MANHÃ" ? (
                                      <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 border-amber-200">
                                        <Sun className="h-3 w-3 mr-1" />
                                        Manhã
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 border-blue-200">
                                        <Moon className="h-3 w-3 mr-1" />
                                        Tarde
                                      </Badge>
                                    )}
                                  </TableCell>

                                  <TableCell className="font-medium">
                                    <Badge className="bg-pink-500/10 dark:bg-pink-500/20 hover:bg-pink-500/10 text-pink-500 border-pink-500/60 shadow-none rounded-full">
                                      <span className="mr-2">🎈</span>
                                      {student.birthDate}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={7}
                                  className="h-24 text-center"
                                >
                                  {searchTerm
                                    ? "Nenhum resultado encontrado."
                                    : "Nenhum aluno aniversariante."}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <hr />
              <div className="container mx-auto py-2">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Total Students Card */}
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-medium text-gray-700">
                          Total de Alunos
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="bg-gray-100 hover:bg-gray-100 text-gray-700"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          Todos
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold">
                        {students.length}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Morning Students Card */}
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-medium text-gray-700">
                          Alunos da Manhã
                        </CardTitle>
                        <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 border-amber-200">
                          <Sun className="h-3 w-3 mr-1" />
                          Manhã
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold">
                        {
                          students.filter(
                            (student) => student.shift === "MANHÃ"
                          ).length
                        }
                      </p>
                    </CardContent>
                  </Card>

                  {/* Afternoon Students Card */}
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-medium text-gray-700">
                          Alunos da Tarde
                        </CardTitle>
                        <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 border-blue-200">
                          <Moon className="h-3 w-3 mr-1" />
                          Tarde
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-semibold">
                        {" "}
                        {
                          students.filter(
                            (student) => student.shift === "TARDE"
                          ).length
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* <Card className="p-6 space-y-6 rounded-lg border hover:border-gray-300"> */}
                {/* Seção de Selecionados */}
                {/* <div className="flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 hover:border-gray-300">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      selected
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Download className="h-3.5 w-3.5" />
                      <span>Export</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>
                </div> */}

                {/* Seção de Busca e Filtros */}
              {/* </Card> */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Buscar alunos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />

                  <Select onValueChange={(value) => setSearchShift(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Turno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Manhã</SelectItem>
                      <SelectItem value="afternoon">Tarde</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  asChild
                  className="bg-[#056bbd] hover:bg-[#056bbd]/80 text-white py-2 px-4 rounded-lg font-semibold"
                >
                  <Link href="/cadastro?tipo=aluno">Cadastrar Novo Aluno</Link>
                </Button>
              </div>

              <div className="rounded-lg border">
                <Table className="text-sm [&_td]:py-2 [&_th]:py-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          // checked={allSelected}
                          // onCheckedChange={toggleSelectAll}
                          // aria-label="Select all rows"
                          // ref={(input) => {
                          //   if (input) {
                          //     input.indeterminate = someSelected;
                          //   }
                          // }}
                          className="translate-y-[2px]"
                        />
                      </TableHead>
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
                        <TableRow key={index} className="">
                          <TableCell className="font-medium">
                            <Checkbox
                              // checked={allSelected}
                              // onCheckedChange={toggleSelectAll}
                              // aria-label="Select all rows"
                              // ref={(input) => {
                              //   if (input) {
                              //     input.indeterminate = someSelected;
                              //   }
                              // }}
                              className="translate-y-[2px]"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-lg">
                              {student.schoolYear}
                            </Badge>
                          </TableCell>
                          <TableCell>{student.guardian}</TableCell>
                          <TableCell>
                            {student.shift === "MANHÃ" ? (
                              <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-700 border-amber-200">
                                <Sun className="h-3 w-3 mr-1" />
                                Manhã
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-100 hover:bg-blue-100 text-blue-700 border-blue-200">
                                <Moon className="h-3 w-3 mr-1" />
                                Tarde
                              </Badge>
                            )}
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
        </div>{" "}
        {/* ou seu conteúdo, como a tabela */}
      </main>
    </div>
  );
}
// green color: #13b387, yellow color: #faa441 and blue color: #056bbd
