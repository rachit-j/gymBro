import { getServerSession } from "next-auth/next";
import { authOptions }       from "../auth/[...nextauth]";
import { PrismaClient }      from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();
  const { id } = req.query;

  if (req.method === "PUT") {
    const { name, defaultSets, defaultReps, defaultWeight, note } = req.body;
    const updated = await prisma.customExercise.update({
      where: { id },
      data: {
        name,
        defaultSets:   defaultSets ? parseInt(defaultSets) : null,
        defaultReps:   defaultReps ? parseInt(defaultReps) : null,
        defaultWeight: defaultWeight ? parseFloat(defaultWeight) : null,
        note,
      },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.customExercise.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
