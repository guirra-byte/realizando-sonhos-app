"use client";

import { Class } from "@/components/turmas/class-management";
import { toast } from "@/components/ui/use-toast";
import { formatCPF, formatName } from "@/utils/format-fns";
import { getSchoolYear } from "@/utils/get-school-year";
import { getShift } from "@/utils/get-shift";
import { Class as DbClass } from "@prisma/client";
import { parse } from "date-fns/parse";
import { Router } from "next/router";
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
      birthDate: parse(
        student.birthDate,
        "dd/MM/yyyy",
        new Date()
      ).toLocaleDateString("pt-BR"),
    };

    const updated = [tmp, ...students];
    setStudents(updated);
    localStorage.setItem("students", JSON.stringify(updated));

    async function createStudent() {
      const resp = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tmp),
      });
      if (!resp.ok) throw new Error("Falha na criação");
      const saved = (await resp.json()) as Student;
      setStudents([saved, ...students]);
      localStorage.setItem("students", JSON.stringify([saved, ...students]));
    }

    createStudent();
  };

  async function updateStudent(updatedStudent: Partial<Student>) {
    
    if(!updatedStudent.name?.includes(" ") || updatedStudent.name.length < 3) {
      toast({
      title: "Erro!",
      description: `O nome do aluno está incompleto.`,
      duration: 5000,
      variant: "destructive",
      })
      return
  }
    const response = await fetch("/api/alunos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

    if (!response.ok) {
      toast({
      title: "❌ Erro!",
      description: `Ocorreu algum problema interno ao editar o aluno.`,
      duration: 5000,
      variant: "destructive",
      })
      
      return
    };
    const saved = (await response.json()) as Student;
    const newList = students.map(s =>
      s.guardianCPF === saved.guardianCPF ? saved : s
    );
    setStudents(newList);
    localStorage.setItem("students", JSON.stringify(newList));

    toast({
      title: "✅ Sucesso!",
      description: `Aluno(a) ${saved.name} editado com sucesso.`,
      duration: 5000,
      variant: "default",
      className: "bg-green-600 text-white",
    });
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
