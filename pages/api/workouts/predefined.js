// pages/api/workouts/predefined.js
import { loadWorkoutsFromCSV } from "../../../lib/loadWorkouts";

export default async function handler(req, res) {
  try {
    const workouts = await loadWorkoutsFromCSV();
    res.status(200).json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load predefined workouts" });
  }
}
