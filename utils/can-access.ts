import { AllowedUserDTO } from "@/app/api/users/route";
import { prismaClient } from "@/lib/prisma";

export const allowedEmails = async (email: string) => {
  const allowedUser: AllowedUserDTO | null =
    await prismaClient.allowedUsers.findUnique({
      where: { email },
    });

  return !allowedUser ? false : true;
};
