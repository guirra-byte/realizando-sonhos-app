import { prismaClient } from "@/lib/prisma";
import { NextApiRequest } from "next";

export async function POST(request: NextApiRequest) {
  const {} = request.body();
}

export async function GET(request: NextApiRequest) {}
