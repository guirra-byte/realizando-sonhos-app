import ClassManagement from "@/components/turmas/class-management";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Turmas() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  return <ClassManagement />;
}
