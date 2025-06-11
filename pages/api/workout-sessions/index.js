import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  if (req.method === "GET") {
    const sessions = await prisma.workoutSession.findMany({
      where: { userId: user.id },
      include: { exercises: true },
      orderBy: { date: "desc" },
    });
    return res.json(sessions);
  }

  if (req.method === "POST") {
    const { title, date, note } = req.body;

    // Parse input date string as local date (not UTC)
    const parseLocalDateOnly = (input) => {
        const [year, month, day] = input.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const parsed = parseLocalDateOnly(date);

    const sessionCreated = await prisma.workoutSession.create({
        data: {
        title,
        date: parsed,
        note,
        userId: user.id,
        },
    });
    return res.status(201).json(sessionCreated);
    }


  res.status(405).end();
}
