// Máscara de CPF
export const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (masked: string) => void) => {
    const value = e.target.value.replace(/\D/g, "");
    const masked = value
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

      callback(masked);
};

// Máscara de telefone
export const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (value: string) => void) => {
    const value = e.target.value.replace(/\D/g, "");
    let masked = value;

    if (value.length <= 10) {
        masked = value
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{4})(\d{4})$/, "$1-$2");
    } else {
        masked = value
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d{5})(\d{4})$/, "$1-$2");
    }

      callback(masked);
};

export function formatCPF(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};