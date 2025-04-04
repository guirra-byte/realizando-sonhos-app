"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CalendarIcon,
  CheckCircle2,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassData } from "./chamada-system";
import { AttendanceHistory } from "./chamada-history";
import { StatusBadge } from "../../utils/badge";
import { getShift } from "@/utils/get-shift";

interface ClassDetailProps {
  classData: ClassData;
  onBack: () => void;
  onMarkAttendance: (
    studentId: string,
    date: string,
    isPresent: boolean
  ) => void;
  addStudentDialog: React.ReactNode;
}

export function ClassDetail({
  classData,
  onBack,
  onMarkAttendance,
  addStudentDialog,
}: ClassDetailProps) {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, "yyyy-MM-dd");

  // Find attendance record for the selected date
  const attendanceRecord = classData.attendanceRecords.find(
    (r) => r.date === formattedDate
  );

  const presentStudentsNames = attendanceRecord?.presentStudentsNames || [];

  // Calculate attendance statistics
  const presentCount = presentStudentsNames.length;
  const totalStudents = classData.students.length;
  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Toggle student attendance
  const toggleAttendance = (studentName: string) => {
    const isCurrentlyPresent = presentStudentsNames.includes(studentName);
    onMarkAttendance(studentName, formattedDate, !isCurrentlyPresent);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">{classData.name}</h2>
            <p className="text-muted-foreground">{classData.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {addStudentDialog}
        </div>
      </div>

      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Chamada de Hoje</TabsTrigger>
          <TabsTrigger value="history">Histórico de Chamadas</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>
                    Chamada do dia {format(date, "MMMM d, yyyy")}
                  </CardTitle>
                  <CardDescription>
                    Marque a presença dos Alunos.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                  <div className="flex items-center gap-1 text-sm">
                    <UserCheck className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{presentCount}</span>
                    <span className="text-muted-foreground">presença</span>
                  </div>
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-1 text-sm">
                    <UserX className="h-4 w-4 text-red-500" />
                    <span className="font-medium">
                      {totalStudents - presentCount}
                    </span>
                    <span className="text-muted-foreground">ausência</span>
                  </div>
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                  <StatusBadge
                    children={`${attendanceRate}%`}
                    type={attendanceRate > 70 ? "success" : "danger"}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {classData.students.length === 0 ? (
                <div className="text-center p-12">
                  <h3 className="text-lg font-medium mb-2">
                    Nenhum estudante adicionado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Adicione alunos à esta Turma
                  </p>
                </div>
              ) : (
                <ul className="divide-y">
                  {classData.students.map((student) => {
                    const isPresent = presentStudentsNames.includes(
                      student.name
                    );

                    return (
                      <li
                        key={student.id}
                        className={`flex items-center justify-between p-4 ${
                          isPresent ? "bg-green-50 dark:bg-green-950/20" : ""
                        } transition-colors duration-200`}
                      >
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            {getShift(student.shift) === "MANHÃ" ? (
                              <Badge className="bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10 text-emerald-500 border-emerald-600/60 shadow-none rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />{" "}
                                {`${student.schoolYear} - ${getShift(
                                  student.shift
                                )}`}
                              </Badge>
                            ) : (
                              <Badge className="bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10 text-red-500 border-red-600/60 shadow-none rounded-full">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2" />{" "}
                                {`${student.schoolYear} - ${getShift(
                                  student.shift
                                )}`}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm mr-2">
                            {isPresent ? (
                              <span className="flex items-center text-green-600 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Presente
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                Ausente
                              </span>
                            )}
                          </p>
                          <Button
                            onClick={() => toggleAttendance(student.name)}
                            variant={isPresent ? "outline" : "default"}
                            size="sm"
                            className={`transition-all ${
                              isPresent
                                ? "border-green-200 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
                                : ""
                            }`}
                          >
                            {isPresent ? "Marcar Ausência" : "Marcar Presença"}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <AttendanceHistory classData={classData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
