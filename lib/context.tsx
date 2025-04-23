"use client";

import { Class } from "@/components/turmas/class-management";
import { formatCPF, formatName } from "@/utils/format-fns";
import { getSchoolYear } from "@/utils/get-school-year";
import { getShift } from "@/utils/get-shift";
import { Class as DbClass } from "@prisma/client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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

export type Student = {
  name: string;
  birthDate: string;
  additionalInfos?: string;
  schoolYear: string;
  shift: string;
  guardian: string;
  guardianCPF: string;
  guardianPhoneNumber: string;
};

export type Responsavel = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  tipoResponsavel: "pai" | "mae" | "outro";
};

// Definindo o tipo para o contexto
type CadastroContextType = {
  students: Student[];
  addStudent: (student: Student) => void;
  addClass: (_class: Class) => void;
  classes: DbClass[];
};

// Criando o contexto
const CadastroContext = createContext<CadastroContextType | undefined>(
  undefined
);

// Provider Component
export function CadastroProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<DbClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    let isMounted = true;

    const fetchClassData = async () => {
      try {
        const response = await fetch("/api/turmas", { method: "GET" });
        if (!response.ok)
          throw new Error(`Error fetching data: ${response.status}`);

        const loadData = (await response.json()) as DbClass[];
        if (isMounted) {
          localStorage.setItem("classes", JSON.stringify(loadData));
          setClasses(loadData);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchStudentsData = async () => {
      try {
        const response = await fetch("/api/alunos", { method: "GET" });
        if (!response.ok)
          throw new Error(`Error fetching data: ${response.status}`);

        const loadData = (await response.json()) as Student[];
        if (isMounted) {
          localStorage.setItem("students", JSON.stringify(loadData));
          setStudents(loadData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const storageStudents = localStorage.getItem("students");
    if (!storageStudents) fetchStudentsData();
    else setStudents(JSON.parse(storageStudents) as Student[]);

    const storageClasses = localStorage.getItem("classes");
    if (!storageClasses) fetchClassData();
    else setClasses(JSON.parse(storageClasses) as DbClass[]);

    return () => {
      isMounted = false;
    };
  }, []);

  // Funções para adicionar alunos
  const addStudent = (student: Student) => {
    const tmp = {
      ...student,
      name: formatName(student.name),
      guardian: formatName(student.guardian),
      guardianCPF: formatCPF(student.guardianCPF),
      shift: getShift(student.shift),
      schoolYear: getSchoolYear(student.schoolYear),
      birthDate: new Date(
        student.birthDate.replaceAll("-", "/")
      ).toLocaleDateString("pt-BR"),
    };

    setStudents((prev) => [tmp, ...prev]);
    localStorage.setItem("students", JSON.stringify(students));

    async function createStudent() {
      await fetch("/api/alunos", {
        method: "POST",
        body: JSON.stringify(tmp),
      });
    }

    createStudent();
  };

  const addClass = (_class: DbClass) => {
    localStorage.removeItem("classes");
    localStorage.setItem("classes", JSON.stringify(_class));

    async function createClass() {
      await fetch("/api/turmas", {
        method: "POST",
        body: JSON.stringify(_class),
      });
    }

    createClass();
  };

  return (
    <CadastroContext.Provider
      value={{ students, addStudent, addClass, classes }}
    >
      {children}
    </CadastroContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useCadastro() {
  const context = useContext(CadastroContext);
  if (context === undefined) {
    throw new Error("useCadastro deve ser usado dentro de um CadastroProvider");
  }
  return context;
}
