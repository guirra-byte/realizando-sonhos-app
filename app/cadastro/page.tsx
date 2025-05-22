import { allowedEmails } from "@/utils/can-access";
import Cadastro from "@/components/cadastro";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CadastroPage() {
  const session = await auth();
  if (session) {
    if (!session.user || !session.user.email) redirect("/unauthorized");
    const entireUserCanAccess = allowedEmails(session.user.email);
    if (!entireUserCanAccess) {
      redirect("/unauthorized");
    }
  }

  return <Cadastro />;
}
