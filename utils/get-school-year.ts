export const getSchoolYear = (schoolYear: string) => {
  return schoolYear
    .toUpperCase()
    .replace(/(\d+)\s*ANO/g, "$1° ANO")
    .replace(/\s+/g, " ")
    .replace(/PRE/g, "PRÉ")
    .trim();
};
