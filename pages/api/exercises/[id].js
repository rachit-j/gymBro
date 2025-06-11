import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const id = req.query.id;

  if (req.method === "PUT") {
    const { sets, reps, weight, note } = req.body;
    const updated = await prisma.exercise.update({
      where: { id },
      data: { sets, reps, weight, note },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.exercise.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
