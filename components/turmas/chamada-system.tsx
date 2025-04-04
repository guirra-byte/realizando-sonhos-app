"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddStudentDialog } from "./add-aluno-dialog";
import { ClassDetail } from "./turma-details";
import { CreateClassForm } from "./create-turma";
import { ClassesDashboard } from "./turmas-dashboard";
import { Sidebar } from "../sidebar";
import { useCadastro } from "@/lib/context";
import { Student } from "@/lib/context";

// Types
// export type Student = {
//   id: string;
//   name: string;
//   email: string;
//   avatar: string;
// };

export type AttendanceRecord = {
  date: string;
  presentStudentsNames: string[];
};

export type ClassData = {
  id: string;
  name: string;
  description: string;
  students: Student[];
  ageRange?: [number, number];
  attendanceRecords: AttendanceRecord[];
};

//Filtrar Students com base no ageRange previamente definido na criação da turma;
//Criar relacionamento entre Student e Class;
export default function AttendanceSystem() {
  const { students } = useCadastro();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Create a new class
  const createClass = (
    newClass: Omit<ClassData, "id" | "students" | "attendanceRecords">
  ) => {
    const classId = `c${classes.length + 1}`;
    const classData: ClassData = {
      id: classId,
      ...newClass,
      students: [],
      ageRange: newClass.ageRange,
      attendanceRecords: [],
    };

    setClasses([...classes, classData]);

    if (classData.ageRange) {
      const entireYear = new Date().getFullYear();
      const [leftEdge, rightEdge] = [
        entireYear - classData.ageRange[0],
        entireYear - classData.ageRange[1],
      ];

      setAllStudents((prev) => [
        ...prev,
        ...students.filter((student) => {
          const bornYear = Number(student.birthDate.split("/")[2]);
          return bornYear >= leftEdge && bornYear <= rightEdge;
        }),
      ]);
    }
  };

  // Add students to a class
  const addStudentsToClass = (classId: string, studentsNames: string[]) => {
    setClasses(
      classes.map((c) => {
        if (c.id === classId) {
          const studentsToAdd = allStudents.filter(
            (s) =>
              studentsNames.includes(s.name) &&
              !c.students.some((cs) => cs.id === s.id)
          );
          return {
            ...c,
            students: [...c.students, ...studentsToAdd],
          };
        }
        return c;
      })
    );

    // Update selected class if it's the one being modified
    if (selectedClass && selectedClass.id === classId) {
      const updatedClass = classes.find((c) => c.id === classId);
      if (updatedClass) {
        setSelectedClass(updatedClass);
      }
    }
  };

  // Mark attendance for a student
  const markAttendance = (
    classId: string,
    studentName: string,
    date: string,
    isPresent: boolean
  ) => {
    setClasses(
      classes.map((c) => {
        if (c.id === classId) {
          // Find or create attendance record for the date
          const recordIndex = c.attendanceRecords.findIndex(
            (r) => r.date === date
          );

          if (recordIndex >= 0) {
            // Update existing record
            const updatedRecords = [...c.attendanceRecords];
            const presentNames = new Set(
              updatedRecords[recordIndex].presentStudentsNames
            );

            if (isPresent) {
              presentNames.add(studentName);
            } else {
              presentNames.delete(studentName);
            }

            updatedRecords[recordIndex] = {
              ...updatedRecords[recordIndex],
              presentStudentsNames: Array.from(presentNames),
            };

            return {
              ...c,
              attendanceRecords: updatedRecords,
            };
          } else {
            // Create new record for the date
            return {
              ...c,
              attendanceRecords: [
                ...c.attendanceRecords,
                {
                  date,
                  presentStudentsNames: isPresent ? [studentName] : [],
                },
              ],
            };
          }
        }
        return c;
      })
    );

    // Update selected class if it's the one being modified
    if (selectedClass && selectedClass.id === classId) {
      const updatedClass = classes.find((c) => c.id === classId);
      if (updatedClass) {
        setSelectedClass(updatedClass);
      }
    }
  };

  // View a specific class
  const viewClass = (classId: string) => {
    const classData = classes.find((c) => c.id === classId);
    if (classData) {
      setSelectedClass(classData);
      setActiveTab("class-detail");
    }
  };

  // Return to dashboard
  const backToDashboard = () => {
    setSelectedClass(null);
    setActiveTab("dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        {" "}
        <div className="flex items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Turmas</h2>
            <p className="text-muted-foreground">
              Cadastre novas turmas e realize chamadas
            </p>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Minhas Turmas</TabsTrigger>
            <TabsTrigger value="create-class">Criar Nova</TabsTrigger>
            {selectedClass && (
              <TabsTrigger value="class-detail">
                {selectedClass.name}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ClassesDashboard classes={classes} onViewClass={viewClass} />
          </TabsContent>

          <TabsContent value="create-class">
            <CreateClassForm onCreateClass={createClass} />
          </TabsContent>

          <TabsContent value="class-detail">
            {selectedClass && (
              <ClassDetail
                classData={selectedClass}
                onBack={backToDashboard}
                onMarkAttendance={(studentId, date, isPresent) =>
                  markAttendance(selectedClass.id, studentId, date, isPresent)
                }
                addStudentDialog={
                  <AddStudentDialog
                    currentClass={selectedClass}
                    classStudents={selectedClass.students}
                    inAgeRangeStudents={}
                    onAddStudents={(studentIds) =>
                      addStudentsToClass(selectedClass.id, studentIds)
                    }
                  />
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
