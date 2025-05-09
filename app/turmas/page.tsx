import { allowedEmails } from "@/can-access";
import ClassManagement from "@/components/turmas/class-management";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Turmas() {
  redirect("/alunos");
  // const session = await auth();

  // if (session) {
  //   if (!session.user || !session.user.email) redirect("/unauthorized");
  //   const entireUserCanAccess = allowedEmails(session.user.email);
  //   if (!entireUserCanAccess) {
  //     redirect("/unauthorized");
  //   }
  // }

  // return <ClassManagement />;
}
