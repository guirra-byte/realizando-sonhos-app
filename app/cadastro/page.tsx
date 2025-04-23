import Cadastro from "@/components/cadastro";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CadastroPage() {
  const session = await auth();
  if (!session?.user) redirect("auth/login");
  return <Cadastro />;
}
