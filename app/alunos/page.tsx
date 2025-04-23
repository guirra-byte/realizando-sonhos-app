import AlunosPage from "@/components/alunos";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Alunos() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  return <AlunosPage user={session.user} />;
}
