import AlunosPage from "@/components/alunos";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { allowedEmails } from "@/utils/can-access";

export default async function Alunos() {
  const session = await auth();
  if (session) {
    if (!session.user || !session.user.email) redirect("/unauthorized");
    const entireUserCanAccess = await allowedEmails(session.user.email);
    if (!entireUserCanAccess) {
      redirect("/unauthorized");
    }
  }

  if (!session?.user) redirect("/auth/login");
  return <AlunosPage user={session.user} />;
}
