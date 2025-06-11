import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { workoutSessionId, name, sets, reps, weight, note } = req.body;

  const exercise = await prisma.exercise.create({
    data: {
        workoutSessionId,
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        note,
    },
    });


  res.status(201).json(exercise);
}
