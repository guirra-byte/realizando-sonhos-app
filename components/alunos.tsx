"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download,
  EllipsisVertical,
  EyeIcon,
  FileDownIcon,
  FileText,
  Moon,
  MoreHorizontal,
  PrinterIcon,
  Shield,
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
  DropdownMenuSeparator,
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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { isAfter, isBefore, isEqual, isSameMonth, parseISO } from "date-fns";
import { Checkbox } from "./ui/checkbox";
import { ConfettiFall } from "./confetti-memo";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { getSchoolYear } from "@/utils/get-school-year";
import { DateTimePicker } from "./ui/datetime-picker";
import { ptBR } from "date-fns/locale";
import { generateReport } from "@/lib/filters-report";

const shiftSelectAssign: Record<string, string> = {
  morning: "MANHÃ",
  afternoon: "TARDE",
};

type ReportProps = {
  name: string;
  code: string;
  description: string;
  createdAt: Date;
};

type UserProps = {
  user?: User;
};
export default function AlunosPage({ user }: UserProps) {
  const { students } = useCadastro();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchGuardian, setSearchGuardian] = useState("");
  const [searchShift, setSearchShift] = useState("both");
  const [searchSchoolYear, setSearchSchoolYear] = useState("");
  const [searchGuardianCPF, setSearchGuardianCPF] = useState<string>("");

  const [searchBirthDateStart, setSearchBirthDateStart] = useState<
    Date | undefined
  >();
  const [searchBirthDateEnd, setSearchBirthDateEnd] = useState<
    Date | undefined
  >();

  const [classes, setClasses] = useState<string[]>([]);
  const [monthBirthdays, setMonthBirthdays] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isInfosModalOpen, setIsInfosModalOpen] = useState(false);
  const [infosModalData, setInfosModalData] = useState<Student>();
  const [disabledClearFilters, setDisabledClearFilters] = useState(true);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const masked = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setSearchGuardianCPF(masked);
  };

  const [report, setReport] = useState<ReportProps>({
    name: "",
    code: "",
    description: "",
    createdAt: new Date(),
  });

  // Populando classes únicas
  useEffect(() => {
    setClasses((prev) => {
      const newClasses = students
        .map(({ schoolYear }) => getSchoolYear(schoolYear))
        .filter((year) => !prev.includes(year));
      return [...new Set([...prev, ...newClasses])];
    });
  }, [students]);

  // Atualiza aniversariantes do mês
  useEffect(() => {
    const birthdays = students.filter((student) =>
      isSameMonth(student.birthDate, new Date())
    );
    setMonthBirthdays(birthdays);
  }, [students]);

  // Confetti render memoizado
  const confetti = useMemo(() => {
    return monthBirthdays.length > 0 ? <ConfettiFall /> : null;
  }, [monthBirthdays.length]);

  // Filtro geral de alunos
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) =>
        searchTerm.trim() !== ""
          ? s.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true
      )
      .filter((s) => {
        const mappedShift = shiftSelectAssign[searchShift];
        return mappedShift ? s.shift === mappedShift : true;
      })
      .filter((s) =>
        searchSchoolYear !== "" ? s.schoolYear === searchSchoolYear : true
      )
      .filter((s) => {
        if (!searchBirthDateStart) return true;
        const birthDate = new Date(s.birthDate);
        return (
          isAfter(birthDate, searchBirthDateStart) ||
          isEqual(birthDate, searchBirthDateStart)
        );
      })
      .filter((s) => {
        if (!searchBirthDateEnd) return true;
        const birthDate = new Date(s.birthDate);
        if (searchBirthDateStart) {
          if (
            ((isAfter(birthDate, searchBirthDateStart) ||
              isEqual(birthDate, searchBirthDateStart)) &&
              isBefore(birthDate, searchBirthDateEnd)) ||
            isEqual(birthDate, searchBirthDateEnd)
          ) {
            return true;
          }
        } else if (
          (!searchBirthDateStart && isBefore(birthDate, searchBirthDateEnd)) ||
          isEqual(birthDate, searchBirthDateEnd)
        ) {
          return true;
        }
      })
      .filter((s) =>
        searchGuardianCPF !== ""
          ? s.guardianCPF.includes(searchGuardianCPF)
          : true
      );
  }, [
    students,
    searchTerm,
    searchShift,
    searchGuardian,
    searchSchoolYear,
    searchGuardianCPF,
    searchBirthDateEnd,
    searchBirthDateStart,
  ]);

  // Totais por turno
  const totalByShift = useMemo(() => {
    let morning = 0,
      afternoon = 0;
    for (const s of students) {
      if (s.shift === "MANHÃ") morning++;
      else if (s.shift === "TARDE") afternoon++;
    }
    return { morning, afternoon };
  }, [students]);

  useEffect(() => {
    const hasAnyFilter =
      searchTerm.trim() !== "" ||
      searchGuardian.trim() !== "" ||
      searchShift !== "both" ||
      searchSchoolYear.trim() !== "" ||
      searchGuardianCPF.trim() !== "" ||
      !!searchBirthDateStart ||
      !!searchBirthDateEnd;

    setDisabledClearFilters(!hasAnyFilter);
  }, [
    searchTerm,
    searchGuardian,
    searchShift,
    searchSchoolYear,
    searchGuardianCPF,
    searchBirthDateStart,
    searchBirthDateEnd,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSearchGuardian("");
    setSearchShift("");
    setSearchSchoolYear("");
    setSearchGuardianCPF("");
    setSearchBirthDateStart(undefined);
    setSearchBirthDateEnd(undefined);
  };

  // Alunos selecionados
  const wholeStudentsSelected =
    filteredStudents.length > 0 &&
    selectedStudents.length === filteredStudents.length;

  const toggleSelectStudent = (target: Student) => {
    setSelectedStudents((prev) => {
      const exists = prev.some((s) => s.name === target.name);
      return exists
        ? prev.filter((s) => s.name !== target.name)
        : [...prev, target];
    });
  };

  const toggleSelectAllStudents = () => {
    setSelectedStudents(wholeStudentsSelected ? [] : filteredStudents);
  };

  const unSelectAllStudents = () => setSelectedStudents([]);

  const handleInfosModal = (target: Student) => {
    const student = students.find((s) => s.name === target.name);
    setInfosModalData(student);
    setIsInfosModalOpen(true);
  };

  const selectedStudentNames = useMemo(
    () => new Set(selectedStudents.map((s) => s.name)),
    [selectedStudents]
  );

  const isChecked = (target: Student) => selectedStudentNames.has(target.name);

  const handleSelectStudent = (student: Student) => () => {
    handleInfosModal(student);
  };

  const downloadReportReady = useMemo(() => {
    return (
      report.name.trim() !== "" &&
      report.code.trim() !== "" &&
      report.description.trim() !== ""
    );
  }, [report]);

  const handleReport = async () => {
    if (downloadReportReady) {
      await generateReport({
        name: report.name,
        code: report.code,
        data: selectedStudents,
        description: report.description,
      });

      unSelectAllStudents();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-full">
        <div className="flex min-h-screen flex-col md:flex-row">
          {/* Main content */}
          <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
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

              {/* Month Birtdays Card */}
              <div className="container min-w-full">
                <div className="grid gap-4">
                  <Card className="overflow-hidden hover:border-gray-300 transition-colors border-t-0 border-grad relative">
                    <div className="h-2 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500"></div>

                    <CardHeader className="pb-2 relative">
                      {/* Container para limitar o confetti */}
                      {confetti}

                      <div className="relative z-10 flex justify-between items-center ">
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
                            {monthBirthdays.length > 0 ? (
                              monthBirthdays.map((student, index) => (
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
                                      className="rounded-lg shadown-sm"
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

              {/* General Infos Card */}
              <div className="container mx-auto py-2 min-w-full">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Total Students Card */}
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
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
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
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
                  <Card className="border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden">
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

              {/* Table Card */}
              <div className="rounded-lg border">
                {/* Selected Students to Export Section */}
                {selectedStudents.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-500 hover:border-gray-300 m-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500/10 dark:bg-green-500/20 hover:bg-green-500/10 text-green-500 border-green-500/60 shadow-none rounded-full">
                        <span className="mr-2">✅</span>
                        {selectedStudents.length} Alunos Selecionados
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={true}
                        className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Deletar</span>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Gerar Relatório</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-full overflow-hidden rounded-xl shadow-lg">
                          <div className="flex flex-col md:flex-row h-full">
                            {/* Lado esquerdo: formulário */}
                            <div className="w-full p-2">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Montar Relatório
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Preencha as informações abaixo para criar um
                                  novo relatório.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleReport();
                                }}
                                className="space-y-4 pt-4"
                              >
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className="bg-green-500/10 text-green-600 border-green-500/60 rounded-full">
                                    ✅ {selectedStudents.length} Alunos
                                    Selecionados
                                  </Badge>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="name">
                                    Nome do Relatório
                                  </Label>
                                  <Input
                                    id="name"
                                    placeholder="Ex: Relatório de Aniversariantes"
                                    value={report.name}
                                    onChange={(e) =>
                                      setReport({
                                        ...report,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="code">Código</Label>
                                  <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                      REL-
                                    </span>
                                    <Input
                                      id="code"
                                      className="rounded-l-none"
                                      placeholder="Ex: 001"
                                      value={report.code}
                                      onChange={(e) =>
                                        setReport({
                                          ...report,
                                          code: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="description">Descrição</Label>
                                  <Textarea
                                    id="description"
                                    placeholder="Descreva o propósito ou conteúdo do relatório..."
                                    value={report.description}
                                    onChange={(e) =>
                                      setReport({
                                        ...report,
                                        description: e.target.value,
                                      })
                                    }
                                  />
                                </div>

                                <AlertDialogFooter className="pt-4">
                                  <AlertDialogCancel asChild>
                                    <Button variant="outline" type="button">
                                      Cancelar
                                    </Button>
                                  </AlertDialogCancel>
                                  <Button
                                    type="submit"
                                    className="bg-[#31A872] text-white"
                                    disabled={!downloadReportReady}
                                  >
                                    <FileDownIcon className="h-4 w-4" />
                                    Baixar Relatório
                                  </Button>
                                </AlertDialogFooter>
                              </form>
                            </div>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => unSelectAllStudents()}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancelar</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Table Filters */}
                <div className="flex flex-col w-full border-b transition-all duration-500 hover:border-gray-300 p-2 gap-3">
                  <div className="flex flex-wrap md:flex-nowrap gap-3 w-full">
                    <Input
                      placeholder="Buscar Aluno..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm flex-1"
                    />

                    <Input
                      placeholder="Buscar pelo Responsável..."
                      value={searchGuardian}
                      onChange={(e) => setSearchGuardian(e.target.value)}
                      className="max-w-sm flex-1"
                    />

                    <Input
                      id="cpf"
                      placeholder="Buscar pelo CPF do Responsável..."
                      maxLength={14}
                      required
                      value={searchGuardianCPF}
                      onChange={handleCpfChange}
                      className="flex-1"
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
                    <Select
                      onValueChange={(value) => setSearchSchoolYear(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c, index) => (
                          <SelectItem key={index} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-gray-400 border border-muted/100 shadow-sm rounded-lg p-2">
                        Filtrar pela Data de nascimento
                      </Label>

                      <DateTimePicker
                        className="w-30"
                        displayFormat={{ hour24: "dd/MM/yyyy" }}
                        placeholder="ex.: 20/02/2015"
                        granularity="day"
                        value={searchBirthDateStart}
                        onChange={setSearchBirthDateStart}
                        locale={ptBR}
                        showOutsideDays={true}
                      />
                      <Label className="text-gray-400 border border-muted/100 shadow-sm rounded-lg p-2">
                        até
                      </Label>

                      <DateTimePicker
                        className="w-30"
                        displayFormat={{ hour24: "dd/MM/yyyy" }}
                        placeholder="ex.: 20/02/2015"
                        granularity="day"
                        value={searchBirthDateEnd}
                        onChange={setSearchBirthDateEnd}
                        locale={ptBR}
                        showOutsideDays={true}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        className="rounded-lg"
                        disabled={disabledClearFilters}
                        onClick={clearFilters}
                      >
                        Limpar Filtros
                      </Button>

                      <div className="hidden md:block h-6 border-l border-gray-300 mx-2" />

                      <Button
                        asChild
                        className="bg-[#056bbd] hover:bg-[#056bbd]/80 text-white py-2 px-4 rounded-lg"
                      >
                        <Link href="/cadastro?tipo=aluno">
                          Cadastrar Novo Aluno
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Students Expand Infos Modal */}
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
                      <AlertDialogAction
                        onClick={() => setIsInfosModalOpen(false)}
                      >
                        Fechar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Students Data Table */}
                <Table className="text-sm [&_td]:py-2 [&_th]:py-1">
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Checkbox
                          checked={wholeStudentsSelected}
                          onCheckedChange={toggleSelectAllStudents}
                          className="translate-y-[2px] border-emerald-400 data-[state=checked]:bg-emerald-400 data-[state=checked]:text-white"
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
                        <TableRow
                          key={index}
                          className={`
                          h-12 transition-colors
                          ${
                            isChecked(student)
                              ? "bg-primary/5 hover:bg-primary/10 transition-all"
                              : "hover:bg-muted/50"
                          }
                        `}
                        >
                          <TableCell className="font-medium">
                            <Checkbox
                              checked={isChecked(student)}
                              onCheckedChange={() =>
                                toggleSelectStudent(student)
                              }
                              className="translate-y-[2px] border-emerald-400 data-[state=checked]:bg-emerald-400 data-[state=checked]:text-white"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {student.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="rounded-lg shadow-sm"
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

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <EllipsisVertical className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={handleSelectStudent(student)}
                                >
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={handleSelectStudent(student)}
                                >
                                  Editar Informações
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={handleSelectStudent(student)}
                                >
                                  Excluir Aluno
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
      </main>
    </div>
  );
}
// green color: #13b387, yellow color: #faa441 and blue color: #056bbd
