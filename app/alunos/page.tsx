import AlunosPage from "@/components/alunos";
import { auth } from "@/lib/auth";

export default async function Alunos() {
  const session = await auth();
  if (!session?.user) return null;
  return <AlunosPage user={session.user} />;
}
