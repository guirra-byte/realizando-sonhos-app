import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export interface AllowedUserProps {
  name: string;
  email: string;
  invitedBy: string;
}

export interface AllowedUserDTO {
  id: string;
  name: string;
  email: string;
  invitedBy: string;
  createdAt: Date;
  lastLoginAt: Date | null;
}

export async function GET(request: Request) {
  const data = (await request.json()) as { email: string };
  try {
    const allowedUser: AllowedUserDTO | null =
      await prismaClient.allowedUsers.findUnique({
        where: { email: data.email },
      });

    if (!allowedUser) {
      return new Response(
        JSON.stringify({ message: "Usuário não encontrado!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return NextResponse.json(allowedUser);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Erro ao buscar dados", error: error.message },
        { status: 500 }
      );
    }
  }
}
