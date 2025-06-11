import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const id = req.query.id;

  if (req.method === "GET") {
    const sessionData = await prisma.workoutSession.findUnique({
      where: { id },
      include: { exercises: true },
    });
    return res.json(sessionData);
  }

  if (req.method === "PUT") {
    const { title, date, note } = req.body;
    const updated = await prisma.workoutSession.update({
      where: { id },
      data: { title, date: new Date(date), note },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.workoutSession.delete({ where: { id } });
    return res.status(204).end();
  }

  res.status(405).end();
}
