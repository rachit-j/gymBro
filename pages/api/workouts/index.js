import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (req.method === "GET") {
    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });
    return res.json(workouts);
  }

  if (req.method === "POST") {
    const { title, sets, reps, weight, note } = req.body;

    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        title,
        date: new Date(),
        exercises: {
          create: [
            {
              name: title,
              sets: parseInt(sets),
              reps: parseInt(reps),
              weight: parseFloat(weight),
              note,
            },
          ],
        },
      },
    });

    return res.status(201).json(workout);
  }

  return res.status(405).end();
}
