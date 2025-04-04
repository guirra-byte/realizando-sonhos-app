export const getShift = (shift: string) => {
  return shift
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/MANHA/g, "MANHÃ")
    .replace(/TARDE/g, "TARDE")
    .trim();
};
