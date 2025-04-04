
export function formatName(name: string) {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCPF(cpf: string) {
  return cpf.replace(/\D/g, '') // Remove não números
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
}

export function formatPhone(phone: string) {
  let digits = phone.replace(/\D/g, ''); // Remove caracteres não numéricos

  if (digits.length === 9) {
    digits = `61${digits}`
  }

  return digits.replace(/\D/g, '') // Remove não números
    .replace(/^(\d{2})(\d)/, '($1) $2') // DDD
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}

export const formatShift = (shift: string) => {
  return shift
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/MANHA/g, "MANHÃ")
    .replace(/TARDE/g, "TARDE")
    .trim();
};

export const formatSchoolYear = (schoolYear: string) => {
  return schoolYear
    .toUpperCase()
    .replace(/(\d+)\s*ANO/g, "$1° ANO")
    .replace(/\s+/g, " ")
    .replace(/PRE/g, "PRÉ")
    .trim();
};