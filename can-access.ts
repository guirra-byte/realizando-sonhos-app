const emails = ["Realizandosonhos05@gmail.com", "guirramatheus1@gmail.com"];
export const allowedEmails = (email?: string | null) => {
  const isAllowed = emails.find((_email) => _email === email);
  return isAllowed ? true : false;
};
