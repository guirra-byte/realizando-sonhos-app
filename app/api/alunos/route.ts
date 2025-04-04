import { Student } from "@/lib/context";
import { prismaClient } from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(request: NextApiRequest) {
  try {
    const students = await prismaClient.student.findMany();
    return NextResponse.json(students);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Erro ao buscar dados", error: error.message },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: Request) {
  const data = (await request.json()) as Student;
  try {
    await prismaClient.student.create({ data: { ...data } });
    return new Response(
      JSON.stringify({ message: "Aluno salvo com sucesso!" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json(
        { message: "Erro ao inserir dados", error: error.message },
        { status: 500 }
      );
    }
  }
}
