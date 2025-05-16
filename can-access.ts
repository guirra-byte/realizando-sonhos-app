const emails = ["realizandosonhos05@gmail.com", "guirramatheus1@gmail.com", "371544jm@gmail.com"];
export const allowedEmails = (email?: string | null) => {
  const isAllowed = emails.find((_email) => _email === email);
  return isAllowed ? true : false;
};
