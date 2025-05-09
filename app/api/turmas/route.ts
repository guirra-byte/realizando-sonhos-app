// import { Class } from "@/components/turmas/class-management";
// import { prismaClient } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// export async function POST(request: Request) {
//   const { name, maxAge, minAge, description } = (await request.json()) as Class;

//   try {
//     await prismaClient.class.create({
//       data: { name, maxAge, minAge, description },
//     });

//     return new Response(
//       JSON.stringify({ message: "Turma cadastrada com sucesso" }),
//       { status: 201, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         { message: "Erro ao inserir dados", error: error.message },
//         { status: 500 }
//       );
//     }
//   }
// }

// export async function PUT(request: Request) {
//   const { students_ids, class_id } = await request.json();

//   try {
//     await prismaClient.student.updateMany({
//       where: { id: { in: students_ids } },
//       data: { classId: class_id },
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         {
//           message: "Erro ao atualizar dados",
//           error: error.message,
//         },
//         { status: 500 }
//       );
//     }
//   }
// }

// // export async function GET() {
// //   try {
// //     const classes = await prismaClient.class.findMany({
// //       where: { students: { some: { classId: { not: undefined } } } },
// //       select: { id: true, : true },
// //     });

// //     return NextResponse.json(classes);
// //   } catch (error) {
// //     if (error instanceof Error) {
// //       return NextResponse.json(
// //         { message: "Erro ao buscar dados", error: error.message },
// //         { status: 500 }
// //       );
// //     }
// //   }
// // }
