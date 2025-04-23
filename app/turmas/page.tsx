import ClassManagement from "@/components/turmas/class-management";
import { auth } from "@/lib/auth";
export default async function Turmas() {
  const session = await auth();
  if (!session?.user) return null;
  return <ClassManagement />;
}
