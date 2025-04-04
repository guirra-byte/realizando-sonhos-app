"use client";

import { useState, type FormEvent, useEffect, ChangeEvent } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import fs from "fs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Student, useCadastro } from "@/lib/context";
import { Sidebar } from "@/components/sidebar";
import { Calendar } from "./ui/calendar";
import { getSchoolYear } from "@/utils/get-school-year";

export default function Cadastro() {
  const router = useRouter();

  const [classes, setClasses] = useState<string[]>([]);
  const [studentHomeLocation, setStudentHomeLocation] = useState("");

  // Estado do formulário de aluno
  const [student, setStudent] = useState<Student>({
    id: 0,
    name: "",
    birthDate: "",
    guardian: "",
    guardianCPF: "",
    schoolYear: "",
    shift: "manha",
    additionalInfos: "",
    guardianPhoneNumber: "",
  });

  // Context para adicionar alunos e responsáveis
  const { students, addStudent } = useCadastro();

  useEffect(() => {
    setClasses((prev) => {
      const newClasses = students
        .map(({ schoolYear }) => getSchoolYear(schoolYear)) // Transforma os alunos em anos escolares
        .filter((year) => !prev.includes(year)); // Filtra os anos que ainda não estão na lista

      return [...new Set([...prev, ...newClasses])]; // Garante que não haja duplicatas
    });
  }, []);

  // Manipulador de envio do formulário de aluno
  const handleStudentSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (
      !student.name ||
      !student.birthDate ||
      !student.guardian ||
      !student.guardianCPF ||
      !student.schoolYear ||
      !student.shift
    ) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Adicionar aluno
    addStudent({ ...student });
    // Limpar formulário
    setStudent({
      id: 0,
      name: "",
      birthDate: "",
      guardian: "",
      guardianCPF: "",
      schoolYear: "",
      shift: "manha",
      additionalInfos: "",
      guardianPhoneNumber: "",
    });

    // Mostrar toast de sucesso
    toast({
      title: "✅ Sucesso",
      description: "Aluno cadastrado com sucesso!",
      style: {
        backgroundColor: "#13b387", // Verde
        color: "#fff", // Texto branco
        borderRadius: "8px", // Bordas arredondadas
        padding: "16px", // Padding para melhor espaçamento
        fontSize: "16px", // Tamanho de fonte agradável
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Sombra suave
      }, // Ícone de sucesso
      duration: 4000, // Duração do toast
    });

    // Redirecionar para a lista de alunos
    router.push("/alunos");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
        <div className="space-y-8">
          <div className="flex items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Cadastros</h2>
              <p className="text-muted-foreground">
                Cadastre novos alunos e responsáveis no sistema
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cadastro de Aluno</CardTitle>
              <CardDescription>
                Preencha os dados do aluno para cadastrá-lo no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-6" onSubmit={handleStudentSubmit}>
                {/* Dados pessoais */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dados Pessoais</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo*</Label>
                      <Input
                        id="nome"
                        placeholder="Nome completo do aluno"
                        required
                        value={student.name}
                        onChange={(e) =>
                          setStudent({ ...student, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data-nascimento">
                        Data de Nascimento*
                      </Label>
                      <Input
                        id="data-nascimento"
                        type="date"
                        required
                        value={student.birthDate}
                        onChange={(e) =>
                          setStudent({
                            ...student,
                            birthDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="guardian">Nome do Responsável*</Label>
                      <Input
                        id="guardian"
                        placeholder="Nome Completo do Responsável"
                        value={student.guardian}
                        onChange={(e) =>
                          setStudent({
                            ...student,
                            guardian: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF do Responsável*</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={student.guardianCPF}
                        onChange={(e) =>
                          setStudent({
                            ...student,
                            guardianCPF: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guardian">Telefone do Responsável*</Label>
                      <Input
                        id="guardian"
                        placeholder="(00) 00000-0000"
                        type="tel"
                        value={student.guardianPhoneNumber}
                        onChange={(e) =>
                          setStudent({
                            ...student,
                            guardianPhoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Turno*</Label>
                    <RadioGroup
                      value={student.shift}
                      onValueChange={(value) =>
                        setStudent({ ...student, shift: value })
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manha" id="manha" />
                        <Label htmlFor="MANHA">Manhã</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tarde" id="tarde" />
                        <Label htmlFor="TARDE">Tarde</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serie">Série*</Label>
                    <Select
                      value={student.schoolYear}
                      onValueChange={(value) =>
                        setStudent({ ...student, schoolYear: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a série" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.length > 0 &&
                          classes.map((_class, index) => {
                            return (
                              <SelectItem key={index} value={_class}>
                                {_class}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfos">
                      Informações Adicionais
                    </Label>
                    <Textarea
                      id="additionalInfos"
                      placeholder="Descreva aqui informações adicionais"
                      value={student.additionalInfos}
                      onChange={(e) =>
                        setStudent({
                          ...student,
                          additionalInfos: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Endereço</h3>

                  <div className="space-y-2">
                    <Label htmlFor="endereco-completo">
                      Endereço Completo*
                    </Label>
                    <Textarea
                      id="endereco-completo"
                      placeholder="Digite o endereço completo (rua, número, bairro, cidade, estado, CEP)"
                      required
                      value={studentHomeLocation}
                      onChange={(e) => setStudentHomeLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => router.push("/")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="bg-[#056bbd] hover:bg-[#045a9f] text-white py-2 px-4 rounded"
                    type="submit"
                  >
                    Cadastrar Aluno
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
