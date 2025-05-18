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
  id?: number,
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
  updateStudent: (student: Partial<Student>) => Promise<void>;
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
 
    const updated = [tmp, ...students];
    setStudents(updated);
    localStorage.setItem("students", JSON.stringify(updated));
    
    async function createStudent() {
      await fetch("/api/alunos", {
        method: "POST",
        body: JSON.stringify(tmp),
      });
    }
    
    createStudent();
  };
  
  async function updateStudent(updatedStudent: Partial<Student>){
    const response = await fetch("/api/alunos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

  if (!response.ok) return;
  const saved = (await response.json()) as Student;
  const newList = students.map(s =>
    s.guardianCPF === saved.guardianCPF ? saved : s
  );
  setStudents(newList);
  localStorage.setItem("students", JSON.stringify(newList));
  }

  return (
    <CadastroContext.Provider
      value={{ students, addStudent, updateStudent }}
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
