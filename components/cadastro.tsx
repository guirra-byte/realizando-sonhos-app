"use client";

import { useState, type FormEvent, useEffect } from "react";
import { CalendarIcon, CircleFadingArrowUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { CurrencyInput } from "@/utils/currency-input";
import { DateTimePicker } from "./ui/datetime-picker";
import { handleCpfChange, handlePhoneChange } from "@/utils/masks";

export type ContratoProps = {
  value: string;
  studentName: string;
  guardian: {
    name: string;
    cpf: string;
    phoneNumber: string;
  };
  at: string;
  shift: string;
};

export default function Cadastro() {
  const router = useRouter();

  // Estados
  const [contractDownloadReady, setContractDownloadReady] = useState(false);
  const [contractValue, setContractValue] = useState("");
  const [contract, setContract] = useState<ContratoProps>({
    value: "",
    studentName: "",
    at: "",
    shift: "",
    guardian: {
      name: "",
      cpf: "",
      phoneNumber: "",
    },
  });

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

  // Contexto
  const { students, addStudent } = useCadastro();

  // Atualizar lista de turmas únicas
  useEffect(() => {
    setClasses((prev) => {
      const newClasses = students
        .map(({ schoolYear }) => getSchoolYear(schoolYear))
        .filter((year) => !prev.includes(year));

      return [...new Set([...prev, ...newClasses])];
    });
  }, []);

  useEffect(() => {
    const generateContract = async ({
      at,
      guardian,
      shift,
      studentName,
      value,
    }: ContratoProps) => {
      try {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight() + 5;
        const margin = 15;
        const contentWidth = pageWidth - margin * 2;

        const lineHeight = 5;

        const addWrappedText = (text: string, y: number, maxWidth: number) => {
          const lines = doc.splitTextToSize(text, maxWidth);
          if (y + lines.length * lineHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }

          doc.text(lines, margin, y);
          return lines.length;
        };

        let yPos = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("ASSOCIAÇÃO REALIZANDO SONHOS", margin, yPos);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        yPos += 6;
        doc.text("CNPJ: 22.399.854/0001-25", margin, yPos);
        yPos += 4;
        doc.text(
          "VARJÃO TORTO – QD. 08 CJ. E LT 15 | CEP: 71540-400",
          margin,
          yPos
        );
        yPos += 4;
        doc.text("TELEFONES: (61) 3468-4594 / 98480-2841", margin, yPos);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        yPos += 5;
        doc.text("CONTRATO ANO LETIVO 2024", margin, yPos);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        yPos += 5;
        const header = `Pelo presente instrumento particular denominado CONTRATO DE MATRÍCULA NO ANO LETIVO 2024, que entre si fazem as partes a seguir qualificadas, tendo de um lado, ASSOCIAÇÃO REALIZANDO SONHOS, entidade com fins social e educacional, inscrita no CNPJ sob o nº 22.399.854/0001-25, com sede a VARJÃO TORTO – QD. 08 CJ. E LT 15 - Brasília - DF, doravante denominada simplesmente CONTRATADA, e de outro lado:

      Responsável: ${guardian.name} | CPF: ${guardian.cpf} | Celular: ${guardian.phoneNumber}
      Denominado CONTRATANTE e RESPONSÁVEL FINANCEIRO pelo aluno(a):
      ${studentName} | Turno: ${shift}

      Têm entre si como justas e contratadas as cláusulas e condições seguintes:`;

        const headerLines = addWrappedText(header, yPos, contentWidth);
        yPos += headerLines * lineHeight - 15;

        const clauses = [
          `CLÁUSULA 1ª
      O objeto do presente contrato é a prestação de serviços educacionais, a serem ministradas pela CONTRATADA, tendo como beneficiário o aluno acima indicado, que cursará durante o ano letivo de 2024;`,

          `CLÁUSULA 2ª
      A CONTRATADA assegura, ao aluno indicado, uma vaga no seu corpo discente, favorecendo a educação por meio do ensino presencial, de aulas e demais atividades pedagógicas, as aulas serão ministradas nas dependências da CONTRATADA.`,

          `CLÁUSULA 3ª
      A CONTRATADA cobrará como contraprestação dos serviços, objeto deste contrato, a serem prestados durante o período letivo de 2024, o valor assinalado abaixo discriminado:
      Valor Contratual: R$ ${value}`,

          `CLÁUSULA 4ª
      Ao firmar o presente contrato, o CONTRATANTE declara que tem conhecimento prévio do REGIMENTO INTERNO, que se encontra à disposição na secretaria da CONTRATADA, e das instruções específicas, que lhe foram apresentadas e que passam a fazer parte integrante deste contrato, submetendo-se às suas disposições.`,

          `CLÁUSULA 5ª
      O CONTRATANTE, representante legal do (a) aluno (a), autoriza a CONTRATADA, durante o período de vigência deste CONTRATO, a utilizar e reproduzir a imagem, a voz e o nome do (a) aluno (a), daqui por diante, denominada imagem para divulgações institucionais, sobretudo durante atividades pedagógicas e projetos especiais da instituições de ensino que possam ser utilizados para fins de demonstração de resultados e de ações educacionais, inclusive nos seus canais institucionais em redes sociais e plataforma online e em conformidade com a legislação vigente, em especial o Estatuto Da Criança e Adolescente.`,

          `CLÁUSULA 6ª
      O presente instrumento entra em vigor no ato da sua assinatura, pelo prazo certo e determinado que deverá coincidir com o término do ano letivo.
      § 1º - Antes do término previsto, o contrato poderá ser rescindido por iniciativa do CONTRATANTE, o que implicará o cancelamento da matrícula e imediata, sendo devida a integralidade das parcelas vencidas.
      § 2º - O contrato poderá ser rescindido por iniciativa da CONTRATADA, caso o aluno beneficiário cometa alguma infração disciplinar que justifique, nos termos do REGIMENTO INTERNO, seu desligamento do estabelecimento de ensino;`,

          `CLÁUSULA 7ª
      As partes contratantes atribuem ao presente contrato plena eficácia e constitui o acordo integral entre as partes com relação ao seu objeto.
      § 2º - As partes elegem o foro de Brasília, Distrito Federal, como o único competente para dirimir quaisquer questões que decorrerem deste contrato, com expressa renúncia de outro, por mais privilegiado que seja ou venha a ser.`,

          `E, por estarem assim, justas e contratadas, firmam o presente instrumento, lavrado em duas vias de igual teor e forma, na presença das duas testemunhas abaixo identificadas.

      Brasília, ${at}
      CONTRATADA: Associação Realizando Sonhos
      CONTRATANTE: ${guardian.name}
      ASSINATURA: ________________________`,
        ];

        let smallestClause = 0;
        for (const clause of clauses) {
          const lines = doc.splitTextToSize(clause, contentWidth);
          if (lines.length < smallestClause || smallestClause === 0) {
            smallestClause = lines.length;
          }

          if (yPos + lines.length * lineHeight > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
          }

          doc.text(lines, margin, yPos);
          const enoughSpacing =
            lines.length * lineHeight - smallestClause * lineHeight;

          yPos += smallestClause * lineHeight + enoughSpacing;
        }

        const [, _, year] = at.split("/");
        const fileName = `Contrato_${year}_${studentName.replace(
          /\s+/g,
          "_"
        )}.pdf`;

        const reply = doc.save(fileName);

        toast({
          title: "Contrato Gerado",
          description: `Contrato salvo como ${fileName}`,
        });
      } catch (error) {
        console.error("Erro ao gerar o contrato:", error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao gerar o contrato.",
          variant: "destructive",
        });
      }
    };

    if (contractDownloadReady) {
      generateContract(contract).then(() => setContractDownloadReady(false));
    }
  }, [contract]);

  // Envio do formulário
  const handleStudentSubmit = (e: FormEvent) => {
    e.preventDefault();

    student.birthDate = new Intl.DateTimeFormat("pt-BR").format(birthDate)

    const { name, guardian, guardianCPF, schoolYear, shift } =
      student;

    const settedMandatoryFields =
      name && guardian && guardianCPF && schoolYear && shift;

    if (!settedMandatoryFields) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setContract({
      value: contractValue,
      studentName: student.name,
      at: new Intl.DateTimeFormat("pt-BR").format(new Date()),
      shift: student.shift,
      guardian: {
        name: student.guardian,
        cpf: student.guardianCPF,
        phoneNumber: student.guardianPhoneNumber,
      },
    });

    addStudent({ ...student });
    setContractDownloadReady(true);

    toast({
      title: `✅ Seja Bem-Vindo ${student.name.split(" ")[0]}!`,
      description: "Aluno cadastrado com sucesso!",
      style: {
        color: "#000",
        borderRadius: "8px",
        padding: "16px",
        fontSize: "16px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      },
      duration: 7000,
    });

    // Resetar campos
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

    // Redirecionar
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

            <Card className="overflow-hidden animate-fadeIn">
              <CardHeader>
                <CardTitle>Cadastro de Aluno</CardTitle>
                <CardDescription>
                  Preencha os dados do aluno para cadastrá-lo no sistema
                </CardDescription>

                <Alert className="bg-emerald-500/10 dark:bg-emerald-600/30 border-emerald-300 dark:border-emerald-600/70">
                  <CircleFadingArrowUpIcon className="h-4 w-4 !text-emerald-500" />
                  <AlertTitle className="!text-emerald-500">
                    O contrato será <strong>gerado automaticamente</strong> após
                    o cadastro do novo Aluno.
                  </AlertTitle>
                </Alert>
              </CardHeader>
              <CardContent className="space-y-6">
                <form className="space-y-6" onSubmit={handleStudentSubmit}>
                  {/* Dados pessoais */}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Valor da Mensalidade</Label>
                      <CurrencyInput
                        value={contract.value}
                        onValueChange={setContractValue}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Dados Pessoais</h3>

                    <div className="grid gap-4 md:grid-cols-3 items-start">
                      {/* Nome - Ocupa 2/3 da grid */}
                      <div className="space-y-2 md:col-span-2">
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

                      {/* Data - Ocupa 1/3 da grid */}
                      <div className="space-y-2 md:col-span-1">
                        <Label htmlFor="data-nascimento">
                          Data de Nascimento*
                        </Label>
                            <DateTimePicker
                              className="w-full justify-start text-left font-normal text-muted-foreground"
                              displayFormat={{ hour24: "dd/MM/yyyy" }}
                              placeholder="ex.: 20/02/2015"
                              granularity="day"
                              value={birthDate}
                              onChange={setBirthDate}
                              locale={ptBR}
                              showOutsideDays={true}
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
                          maxLength={14}
                          required
                          value={student.guardianCPF}
                          onChange={(e) => handleCpfChange(e, (masked) => setStudent(prev => ({ ...prev, guardianCPF: masked })))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guardian">
                          Telefone do Responsável*
                        </Label>
                        <Input
                          id="guardian"
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          required
                          type="tel"
                          value={student.guardianPhoneNumber}
                          onChange={(e) => handlePhoneChange(e, (masked) => setStudent(prev => ({ ...prev, guardianPhoneNumber: masked})))}
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
