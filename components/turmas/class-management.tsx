"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  X,
  Plus,
  CalendarIcon,
  Search,
  Users,
  UserPlus,
  BookOpen,
  PercentIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO, isToday, isPast, isFuture } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "../sidebar";
import { useCadastro } from "@/lib/context";
import { ptBR } from "date-fns/locale";

// Types
type Student = {
  id: string;
  name: string;
};

export type Class = {
  id: string;
  name: string;
  description: string;
  students: string[]; // Student IDs
  minAge: number;
  maxAge: number;
};

type Attendance = {
  date: string; // ISO date string
  present: string[]; // Student IDs
  absent: string[]; // Student IDs
};

export default function ClassManagement() {
  // State
  const { addClass: saveClass, classes: allClasses } = useCadastro();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newClassName, setNewClassName] = useState("");
  const [newClassMinAge, setNewClassMinAge] = useState<number>(0);
  const [newClassMaxAge, setNewClassMaxAge] = useState<number>(1);
  const [newClassDescription, setNewClassDescription] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [viewMode, setViewMode] = useState<"mark" | "history">("mark");
  const [historyFilter, setHistoryFilter] = useState<
    "all" | "present" | "absent"
  >("all");

  // Handlers
  const addClass = () => {
    if (!newClassName.trim()) return;
    if (newClassMinAge > newClassMaxAge) return;

    const newClass = {
      id: Date.now().toString(),
      name: newClassName,
      students: [],
      minAge: newClassMinAge,
      maxAge: newClassMaxAge,
      description: newClassDescription,
    };
    setClasses([...classes, newClass]);
    saveClass({ ...newClass });

    setNewClassName("");
    setNewClassMinAge(0);
    setNewClassMaxAge(1);
    setNewClassDescription("");
  };

  const addStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent = {
      id: Date.now().toString(),
      name: newStudentName,
    };
    setStudents([...students, newStudent]);
    setNewStudentName("");
  };

  const removeStudent = (classId: string, studentId: string) => {
    setClasses(
      classes.map((c) =>
        c.id === classId
          ? { ...c, students: c.students.filter((id) => id !== studentId) }
          : c
      )
    );
  };

  const markAttendance = (
    date: string,
    studentId: string,
    isPresent: boolean
  ) => {
    const dateStr = date;
    const existingRecord = attendance.find((a) => a.date === dateStr);

    if (existingRecord) {
      setAttendance(
        attendance.map((a) => {
          if (a.date === dateStr) {
            if (isPresent) {
              return {
                ...a,
                present: [
                  ...a.present.filter((id) => id !== studentId),
                  studentId,
                ],
                absent: a.absent.filter((id) => id !== studentId),
              };
            } else {
              return {
                ...a,
                absent: [
                  ...a.absent.filter((id) => id !== studentId),
                  studentId,
                ],
                present: a.present.filter((id) => id !== studentId),
              };
            }
          }
          return a;
        })
      );
    } else {
      setAttendance([
        ...attendance,
        {
          date: dateStr,
          present: isPresent ? [studentId] : [],
          absent: isPresent ? [] : [studentId],
        },
      ]);
    }
  };

  // Helper functions
  const getStudentById = (id: string) => students.find((s) => s.id === id);
  const getClassById = (id: string) => classes.find((c) => c.id === id);
  const getAttendanceForDate = (date: string) =>
    attendance.find((a) => a.date === date);

  const getStudentStatus = (studentId: string, date: string) => {
    const record = getAttendanceForDate(date);
    if (!record) return null;
    if (record.present.includes(studentId)) return "present";
    if (record.absent.includes(studentId)) return "absent";
    return null;
  };

  const getAttendanceHistory = (classId: string) => {
    if (!classId) return [];

    const classObj = getClassById(classId);
    if (!classObj) return [];

    // Get all dates with attendance records for this class
    const relevantAttendance = attendance.filter((record) => {
      const hasClassStudents = classObj.students.some(
        (studentId) =>
          record.present.includes(studentId) ||
          record.absent.includes(studentId)
      );
      return hasClassStudents;
    });

    // Sort by date (newest first)
    return relevantAttendance.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getAttendanceStats = (record: Attendance, classId: string) => {
    const classObj = getClassById(classId);
    if (!classObj) return { present: 0, absent: 0, total: 0, percentage: 0 };

    const presentCount = classObj.students.filter((id) =>
      record.present.includes(id)
    ).length;
    const absentCount = classObj.students.filter((id) =>
      record.absent.includes(id)
    ).length;
    const total = classObj.students.length;
    const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

    return {
      present: presentCount,
      absent: absentCount,
      total,
      percentage,
    };
  };

  const getClassAttendanceRate = (classId: string) => {
    const classObj = getClassById(classId);
    if (!classObj || classObj.students.length === 0)
      return { present: 0, absent: 0, total: 0, percentage: 0 };

    const classAttendance = getAttendanceHistory(classId);
    if (classAttendance.length === 0)
      return { present: 0, absent: 0, total: 0, percentage: 0 };

    let totalPresent = 0;
    let totalPossible = 0;

    classAttendance.forEach((record) => {
      const stats = getAttendanceStats(record, classId);
      totalPresent += stats.present;
      totalPossible += stats.total;
    });

    const percentage =
      totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;

    return {
      present: totalPresent,
      absent: totalPossible - totalPresent,
      total: totalPossible,
      percentage,
    };
  };

  const selectedClassObj = selectedClass ? getClassById(selectedClass) : null;
  const dateStr = selectedDate.toISOString().split("T")[0];
  const attendanceHistory = selectedClass
    ? getAttendanceHistory(selectedClass)
    : [];

  // Filtered attendance history based on filter
  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return attendanceHistory;

    if (historyFilter === "present") {
      return attendanceHistory.filter((record) => {
        const stats = getAttendanceStats(record, selectedClass!);
        return stats.present > 0;
      });
    }

    if (historyFilter === "absent") {
      return attendanceHistory.filter((record) => {
        const stats = getAttendanceStats(record, selectedClass!);
        return stats.absent > 0;
      });
    }

    return attendanceHistory;
  }, [attendanceHistory, historyFilter, selectedClass]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-screen flex-col md:flex-row">
          <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
            <div className="flex items-center mb-5">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#F4A03A]">
                  Turmas
                </h2>
                <p className="text-muted-foreground">
                  Listagem de todas as turmas cadastradas no sistema
                </p>
              </div>
            </div>

            <Tabs defaultValue="classes">
              <TabsList className="grid w-full grid-cols-2 mb-6 h-full">
                <TabsTrigger value="classes" className="text-base py-3">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Turmas
                </TabsTrigger>
                {/* <TabsTrigger value="students" className="text-base py-3">
               <Users className="h-4 w-4 mr-2" />
               Alunos
             </TabsTrigger> */}
                <TabsTrigger value="attendance" className="text-base py-3">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Chamada
                </TabsTrigger>
              </TabsList>

              {/* Classes Tab */}
              <TabsContent value="classes">
                <div className="grid md:grid-cols-3 gap-6 max-h-full">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Adicionar Nova Turma</CardTitle>
                      <CardDescription>
                        Criar nova turma com intervalo de Idades e Descrição
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label
                            htmlFor="class-name"
                            className="text-sm font-medium mb-1 block"
                          >
                            Nome da Turma
                          </label>
                          <Input
                            id="class-name"
                            placeholder="Digite o Nome da Turma"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="min-age"
                              className="text-sm font-medium mb-1 block"
                            >
                              Idade Mínima
                            </label>
                            <Input
                              id="min-age"
                              type="number"
                              placeholder="Min"
                              value={
                                newClassMinAge === undefined
                                  ? ""
                                  : newClassMinAge
                              }
                              onChange={(e) =>
                                setNewClassMinAge(
                                  e.target.value
                                    ? Number.parseInt(e.target.value)
                                    : 0
                                )
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="max-age"
                              className="text-sm font-medium mb-1 block"
                            >
                              Idade Máxima
                            </label>
                            <Input
                              id="max-age"
                              type="number"
                              placeholder="Max"
                              value={
                                newClassMaxAge === undefined
                                  ? ""
                                  : newClassMaxAge
                              }
                              onChange={(e) =>
                                setNewClassMaxAge(
                                  e.target.value
                                    ? Number.parseInt(e.target.value)
                                    : 1
                                )
                              }
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="class-description"
                            className="text-sm font-medium mb-1 block"
                          >
                            Descrição
                          </label>
                          <Textarea
                            id="class-description"
                            placeholder="Digite uma Descrição"
                            value={newClassDescription}
                            onChange={(e) =>
                              setNewClassDescription(e.target.value)
                            }
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={addClass}
                        className="w-full bg-[#F4A03A] text-white font-semibold py-2 px-4 rounded-lg"
                      >
                        Adicionar Turma
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="md:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Nossas Turmas</h2>

                    {classes.length === 0 ? (
                      <Card className="p-8 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Nenhuma turma criada. Crie uma turma para começar.
                        </p>
                      </Card>
                    ) : (
                      <ScrollArea className="h-80 w-full rounded-md border bg-white p-4">
                        <div className="grid gap-2 overflow-hidden">
                          {classes.map((cls) => {
                            const classStats = getClassAttendanceRate(cls.id);
                            return (
                              <Card key={cls.id}>
                                <div key={cls.id}>
                                  <div className="bg-white p-3">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="text-xl font-bold">
                                          {cls.name}
                                        </h3>
                                        {cls.minAge !== undefined &&
                                          cls.maxAge !== undefined && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                              Intervalo de Idades: {cls.minAge}{" "}
                                              - {cls.maxAge} Anos
                                            </div>
                                          )}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="flex items-center gap-1"
                                      >
                                        <Users className="h-3 w-3 mr-1" />
                                        {cls.students.length} alunos
                                      </Badge>
                                    </div>
                                    {cls.description && (
                                      <p className="mt-3 text-sm">
                                        {cls.description}
                                      </p>
                                    )}

                                    {classStats.total > 0 && (
                                      <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                          <span>Attendance Rate</span>
                                          <span className="font-medium">
                                            {classStats.percentage}%
                                          </span>
                                        </div>
                                        <Progress
                                          value={classStats.percentage}
                                          className="h-2"
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {cls.students.length > 0 && (
                                    <CardContent className="pt-4">
                                      <h4 className="text-sm font-medium mb-2">
                                        Enrolled Students
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {cls.students.map((studentId) => {
                                          const student =
                                            getStudentById(studentId);
                                          return student ? (
                                            <Badge
                                              key={studentId}
                                              variant="secondary"
                                              className="flex items-center gap-1"
                                            >
                                              {student.name}
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 ml-1"
                                                onClick={() =>
                                                  removeStudent(
                                                    cls.id,
                                                    studentId
                                                  )
                                                }
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </Badge>
                                          ) : null;
                                        })}
                                      </div>
                                    </CardContent>
                                  )}
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Selecione uma Turma e uma Data</CardTitle>
                        <CardDescription>
                          Escolha uma Turma e uma Data para visualizar a Lista
                          de Presença
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label
                            htmlFor="class-select"
                            className="text-sm font-medium mb-1 block"
                          >
                            Turma
                          </label>
                          <Select
                            onValueChange={setSelectedClass}
                            value={selectedClass || undefined}
                            disabled={classes.length === 0}
                          >
                            <SelectTrigger id="class-select">
                              <SelectValue placeholder="Selecione uma Turma" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Data
                          </label>
                          <div className="w-full flex justify-center items-center ">
                            <Calendar
                              mode="single"
                              locale={ptBR}
                              selected={selectedDate}
                              onSelect={(date) => date && setSelectedDate(date)}
                              className="rounded-md border w-full flex justify-center items-center"
                            />
                          </div>
                        </div>

                        <div className="w-full flex justify-center items-center">
                          <div className="flex justify-between items-center">
                            <Button
                              variant={
                                viewMode === "mark" ? "default" : "outline"
                              }
                              onClick={() => setViewMode("mark")}
                              className="flex-1"
                            >
                              Assinar Chamada
                            </Button>
                            <Separator
                              orientation="vertical"
                              className="h-8 mx-2"
                            />
                            <Button
                              variant={
                                viewMode === "history" ? "default" : "outline"
                              }
                              onClick={() => setViewMode("history")}
                              className="flex-1"
                            >
                              Ver Chamada
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2">
                    {viewMode === "mark" ? (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle>Assinar Chamada</CardTitle>
                              <CardDescription>
                                {format(selectedDate, "EEEE, MMMM d, yyyy", {
                                  locale: ptBR,
                                })}
                                {isToday(selectedDate) && (
                                  <Badge className="ml-2">Hoje</Badge>
                                )}
                                {isPast(selectedDate) &&
                                  !isToday(selectedDate) && (
                                    <Badge variant="outline" className="ml-2">
                                      Passado
                                    </Badge>
                                  )}
                                {isFuture(selectedDate) && (
                                  <Badge variant="outline" className="ml-2">
                                    Futuro
                                  </Badge>
                                )}
                              </CardDescription>
                            </div>
                            {selectedClassObj && (
                              <Badge
                                variant="outline"
                                className="text-base font-normal py-1.5"
                              >
                                {selectedClassObj.name}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {selectedClassObj ? (
                            selectedClassObj.students.length > 0 ? (
                              <div className="space-y-1">
                                {selectedClassObj.students.map((studentId) => {
                                  const student = getStudentById(studentId);
                                  const status = getStudentStatus(
                                    studentId,
                                    dateStr
                                  );

                                  return student ? (
                                    <div
                                      key={studentId}
                                      className={`flex items-center justify-between p-3 rounded-lg border ${
                                        status === "present"
                                          ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900"
                                          : status === "absent"
                                          ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900"
                                          : "bg-card"
                                      }`}
                                    >
                                      <div className="font-medium">
                                        {student.name}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          variant={
                                            status === "present"
                                              ? "default"
                                              : "outline"
                                          }
                                          className={
                                            status === "present"
                                              ? "bg-green-600 hover:bg-green-700"
                                              : ""
                                          }
                                          onClick={() =>
                                            markAttendance(
                                              dateStr,
                                              studentId,
                                              true
                                            )
                                          }
                                        >
                                          <Check className="h-4 w-4 mr-1" />{" "}
                                          Present
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant={
                                            status === "absent"
                                              ? "destructive"
                                              : "outline"
                                          }
                                          onClick={() =>
                                            markAttendance(
                                              dateStr,
                                              studentId,
                                              false
                                            )
                                          }
                                        >
                                          <X className="h-4 w-4 mr-1" /> Absent
                                        </Button>
                                      </div>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-12 px-4">
                                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">
                                  No students in this class
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                  Add students to the class to mark attendance.
                                </p>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const studentsTab = document.querySelector(
                                      '[value="students"]'
                                    ) as HTMLElement;
                                    if (studentsTab) studentsTab.click();
                                  }}
                                >
                                  Go to Students Tab
                                </Button>
                              </div>
                            )
                          ) : (
                            <div className="text-center py-12 px-4">
                              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">
                                Nenhuma Turma selecionada
                              </h3>
                              <p className="text-muted-foreground">
                                Por favor selecione uma Turma para Assinar a
                                Chamada.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle>Histórico de Chamadas</CardTitle>
                              <CardDescription>
                                {selectedClassObj
                                  ? selectedClassObj.name
                                  : "Selecione uma Turma para ver o Histórico"}
                              </CardDescription>
                            </div>
                            {filteredHistory.length > 0 && (
                              <Badge
                                variant="outline"
                                className="text-base font-normal py-1.5"
                              >
                                {filteredHistory.length} Records
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {selectedClassObj ? (
                            <ScrollArea className="h-[600px] pr-4">
                              {filteredHistory.length > 0 ? (
                                <div className="space-y-4">
                                  {filteredHistory.map((record) => {
                                    const stats = getAttendanceStats(
                                      record,
                                      selectedClass!
                                    );
                                    const date = parseISO(record.date);
                                    const isCurrentDay =
                                      new Date(record.date).toDateString() ===
                                      new Date().toDateString();

                                    return (
                                      <Card
                                        key={record.date}
                                        className="overflow-hidden"
                                      >
                                        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4">
                                          <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                                              <div>
                                                <span className="font-medium">
                                                  {format(
                                                    date,
                                                    "EEEE, MMMM d, yyyy",
                                                    { locale: ptBR }
                                                  )}
                                                </span>
                                                {isCurrentDay && (
                                                  <Badge className="ml-2">
                                                    Hoje
                                                  </Badge>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <PercentIcon className="h-4 w-4 text-primary" />
                                              <span className="font-bold">
                                                {stats.percentage}%
                                              </span>
                                            </div>
                                          </div>
                                          <Progress
                                            value={stats.percentage}
                                            className="h-2 mt-2"
                                          />
                                        </div>

                                        <CardContent className="p-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <div className="flex items-center mb-2">
                                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                                <h4 className="text-sm font-medium">
                                                  Presente ({stats.present})
                                                </h4>
                                              </div>
                                              <div className="space-y-1">
                                                {record.present.length > 0 ? (
                                                  record.present.map(
                                                    (studentId) => {
                                                      const student =
                                                        getStudentById(
                                                          studentId
                                                        );
                                                      return student &&
                                                        selectedClassObj.students.includes(
                                                          studentId
                                                        ) ? (
                                                        <div
                                                          key={studentId}
                                                          className="text-sm flex items-center p-1.5 rounded-md bg-green-50 dark:bg-green-950/30"
                                                        >
                                                          <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                                                          {student.name}
                                                        </div>
                                                      ) : null;
                                                    }
                                                  )
                                                ) : (
                                                  <div className="text-sm text-muted-foreground italic">
                                                    Nenhum Aluno Presente
                                                  </div>
                                                )}
                                              </div>
                                            </div>

                                            <div>
                                              <div className="flex items-center mb-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                                <h4 className="text-sm font-medium">
                                                  Faltas ({stats.absent})
                                                </h4>
                                              </div>
                                              <div className="space-y-1">
                                                {record.absent.length > 0 ? (
                                                  record.absent.map(
                                                    (studentId) => {
                                                      const student =
                                                        getStudentById(
                                                          studentId
                                                        );
                                                      return student &&
                                                        selectedClassObj.students.includes(
                                                          studentId
                                                        ) ? (
                                                        <div
                                                          key={studentId}
                                                          className="text-sm flex items-center p-1.5 rounded-md bg-red-50 dark:bg-red-950/30"
                                                        >
                                                          <X className="h-3.5 w-3.5 mr-1.5 text-red-600" />
                                                          {student.name}
                                                        </div>
                                                      ) : null;
                                                    }
                                                  )
                                                ) : (
                                                  <div className="text-sm text-muted-foreground italic">
                                                    Nenhuma Falta
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-12 px-4">
                                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                  <h3 className="text-lg font-medium mb-2">
                                    Nenhuma Chamada Registrada
                                  </h3>
                                  <p className="text-muted-foreground mb-4">
                                    {historyFilter !== "all"
                                      ? "Try changing your filter settings."
                                      : "Start marking attendance to see history."}
                                  </p>
                                  {historyFilter !== "all" && (
                                    <Button
                                      variant="outline"
                                      onClick={() => setHistoryFilter("all")}
                                    >
                                      Mostrar Todas as Chamadas
                                    </Button>
                                  )}
                                </div>
                              )}
                            </ScrollArea>
                          ) : (
                            <div className="text-center py-12 px-4">
                              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">
                                Nenhumas Turma Selecionada
                              </h3>
                              <p className="text-muted-foreground">
                                Por Favor selecione uma Turma para ver o
                                Histórico de Chamadas.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
