import { toast } from "@/components/ui/use-toast"
import { Student } from "@/lib/context"

export function validateStudent(updatedStudent: Partial<Student>): boolean {
    const REQUIRED_FIELDS = updatedStudent.name && updatedStudent.birthDate && updatedStudent.guardian && updatedStudent.guardianPhoneNumber && updatedStudent.guardianCPF
    const phoneNumberDigits = updatedStudent.guardianPhoneNumber?.replace(/\D/g, "");
    const cpfDigits = updatedStudent.guardianCPF?.replace(/\D/g, "");

    if (!REQUIRED_FIELDS) {
      toast({
      title: "❌ Erro!",
      description: "Campos obrigatórios não foram preenchidos!",
      duration: 7000,
      variant: "destructive",
      })
      return false
    }

    // Verificação do nome do aluno e responsável
    if(!updatedStudent.name?.includes(" ") || updatedStudent.name.length < 3 || !updatedStudent.guardian?.includes(" ") || updatedStudent.guardian.length < 3)  {
      toast({
      title: "❌ Erro!",
      description: "O nome do aluno ou do responsável está incompleto.",
      duration: 7000,
      variant: "destructive",
      })
      return false
    }

    //verificação CPF do responsável
    if(cpfDigits && cpfDigits.length < 11) {
      toast({
      title: "❌ Erro!",
      description: "O CPF do responsável está incompleto.",
      duration: 7000,
      variant: "destructive",
      })
      return false
    }
    
    //verificação telefone do responsável
    if(phoneNumberDigits && phoneNumberDigits.length < 11) {
      toast({
      title: "❌ Erro!",
      description: "O contato do responsável está incompleto.",
      duration: 7000,
      variant: "destructive",
      })
      return false
    }
    return true
}