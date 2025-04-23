import Cadastro from "@/components/cadastro";
import { auth } from "@/lib/auth";

export default async function CadastroPage() {
  const session = await auth();
  if (!session?.user) return null;
  return <Cadastro />;
}
