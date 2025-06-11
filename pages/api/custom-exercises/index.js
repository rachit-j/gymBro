import { getServerSession } from "next-auth/next";
import { authOptions }       from "../auth/[...nextauth]";
import { PrismaClient }      from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (req.method === "GET") {
    const list = await prisma.customExercise.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json(list);
  }

  if (req.method === "POST") {
    const { name, defaultSets, defaultReps, defaultWeight, note } = req.body;
    const created = await prisma.customExercise.create({
      data: {
        userId:       user.id,
        name,
        defaultSets:   defaultSets ? parseInt(defaultSets) : null,
        defaultReps:   defaultReps ? parseInt(defaultReps) : null,
        defaultWeight: defaultWeight ? parseFloat(defaultWeight) : null,
        note,
      },
    });
    return res.status(201).json(created);
  }

  res.status(405).end();
}
