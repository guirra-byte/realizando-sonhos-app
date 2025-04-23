"use client";

import { useState, type FormEvent, useEffect, ChangeEvent } from "react";
import { ArrowLeft, CalendarIcon } from "lucide-react";
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
import { getSchoolYear } from "@/utils/get-school-year";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale/pt-BR";
export default function Cadastro() {
  const router = useRouter();

  const [classes, setClasses] = useState<string[]>([]);
  const [studentHomeLocation, setStudentHomeLocation] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();

  // Estado do formulário de aluno
  const [student, setStudent] = useState<Student>({
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

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const masked = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setStudent({ ...student, guardianCPF: masked });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let masked = value;

    if (value.length <= 10) {
      // telefone fixo: (11) 1234-5678
      masked = value
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d{4})$/, "$1-$2");
    } else {
      // celular: (11) 91234-5678
      masked = value
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d{4})$/, "$1-$2");
    }

    setStudent({ ...student, guardianPhoneNumber: masked });
  };
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
      title: `✅ Seja Bem-Vindo ${student.name.split(" ")[0]}!`,
      description: "Aluno cadastrado com sucesso!",
      style: {
        // Verde
        color: "#000", // Texto branco
        borderRadius: "8px", // Bordas arredondadas
        padding: "16px", // Padding para melhor espaçamento
        fontSize: "16px", // Tamanho de fonte agradável
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Sombra suave
      }, // Ícone de sucesso
      duration: 7000, // Duração do toast
    });

    // Redirecionar para a lista de alunos
    router.push("/alunos");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
          <div className="space-y-8">
            <div className="flex items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#31A872]">
                  Cadastros
                </h2>
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

                    <div className="grid gap-4 md:grid-cols-2 items-center justify-center">
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
                        <label
                          htmlFor="data-nascimento"
                          className="text-sm font-medium"
                        >
                          Data de Nascimento*
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal text-muted-foreground"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {birthDate ? (
                                format(birthDate, 'dd/MM/yyyy', { locale: ptBR })
                              ) : (
                                <span>Selecionar data</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              locale={ptBR}
                              id="data-nascimento"
                              selected={birthDate}
                              onSelect={(e) => {
                                if (e) {
                                  setBirthDate(e);
                                  setStudent((prev) => ({
                                    ...prev,
                                    birthDate: format(e, 'dd/MM/yyyy'), // ou outro formato que precisar
                                  }));
                                }
                              }}
                              initialFocus
                              required
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="guardian">Nome do Responsável*</Label>
                        <Input
                          id="guardian"
                          placeholder="Nome Completo do Responsável"
                          value={student.guardian}
                          required
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
                          required
                          value={student.guardianCPF}
                          onChange={handleCpfChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guardian">
                          Telefone do Responsável*
                        </Label>
                        <Input
                          id="guardian"
                          placeholder="(00) 00000-0000"
                          required
                          type="tel"
                          value={student.guardianPhoneNumber}
                          onChange={handlePhoneChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Turno*</Label>
                      <RadioGroup
                        value={student.shift}
                        required
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
                        required
                        onValueChange={(value) =>
                          setStudent({ ...student, schoolYear: value })
                        }
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
                      className="py-2 px-4 rounded-lg"
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="bg-[#31A872] text-white py-2 px-4 rounded-lg"
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
      </main>
    </div>
  );
}
