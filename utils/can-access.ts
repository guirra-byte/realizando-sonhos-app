export const allowedEmails = async (email?: string | null) => {
  const response = await fetch("/users", {
    method: "GET",
    body: JSON.stringify({ email }),
  });

  return response.status === 404 ? false : true;
};
