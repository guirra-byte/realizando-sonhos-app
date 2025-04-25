export const allowedEmails = (email?: string | null) => {
  if (!process.env.ALLOWED_EMAILS) return false;

  const emails = process.env.ALLOWED_EMAILS.split(",");
  const isAllowed = emails.find((_email) => _email === email);

  return isAllowed ? true : false;
};
