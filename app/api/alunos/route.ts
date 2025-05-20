import { Student } from "@/lib/context";
import { prismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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
    const created = await prismaClient.student.create({ data });
    return new Response(
      JSON.stringify(created),
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

export async function PUT(request: Request) {
  const data = (await request.json());
  const { id, ...rest } = data;
  try {
    const updatedStudent = await prismaClient.student.update({
      where: { id },
      data: rest,
    })
    return new Response(JSON.stringify(updatedStudent),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Erro ao editar aluno", error: String(error) }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const data = await request.json();
  const { id } = data
  try {
    await prismaClient.student.delete({
      where: { id },
    })
    return new Response(JSON.stringify({
      status: 200,
      headers: { "Content-Type": "application/json" }
    }))
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Erro ao excluir aluno", error: String(error) }),
      { status: 500 }
    )
  }
}