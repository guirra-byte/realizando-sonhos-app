"use client";

import { ClassData } from "@/components/turmas/chamada-system";
import { formatCPF, formatName } from "@/utils/format-fns";
import { getSchoolYear } from "@/utils/get-school-year";
import { getShift } from "@/utils/get-shift";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Definindo os tipos para alunos e responsáveis
export type Aluno = {
  id: string;
  nome: string;
  dataNascimento: string;
  cpf?: string;
  idade: number;
  turno: "manha" | "tarde";
  serie: string;
  alergias?: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  enderecoCompleto: string;
  dataCadastro: string;
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
};

// Criando o contexto
const CadastroContext = createContext<CadastroContextType | undefined>(
  undefined
);

// Provider Component
export function CadastroProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    let isMounted = true;

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
    localStorage.removeItem("students")
    localStorage.setItem("students", JSON.stringify(students))
    
    async function createStudent() {
      await fetch("/api/alunos", {
        method: "POST",
        body: JSON.stringify(tmp),
      });
    }

    createStudent();
  };

  return (
    <CadastroContext.Provider value={{ students, addStudent }}>
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
