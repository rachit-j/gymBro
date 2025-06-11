import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddExerciseToSessionForm from "@/components/AddExerciseToSessionForm";

export default function SessionDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [sessionData, setSessionData] = useState(null);
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    note: "",
  });

  const loadSession = async () => {
    const res = await fetch(`/api/workout-sessions/${id}`);
    const data = await res.json();
    setSessionData(data);
  };

  useEffect(() => {
    if (id) loadSession();
  }, [id]);

  const addExercise = async () => {
    const res = await fetch("/api/workout-sessions/add-exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newExercise, workoutSessionId: id }),
    });

    if (res.ok) {
      await loadSession();
      setNewExercise({ name: "", sets: "", reps: "", weight: "", note: "" });
    }
  };

  const deleteExercise = async (exerciseId) => {
    await fetch(`/api/exercises/${exerciseId}`, { method: "DELETE" });
    await loadSession();
  };

  if (!sessionData) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{sessionData.title}</h1>
      <p>Date: {new Date(sessionData.date).toLocaleDateString()}</p>
      <p>Note: {sessionData.note || "(none)"}</p>

      <h2>Exercises</h2>
      {sessionData.exercises.length === 0 ? (
        <p>No exercises yet</p>
      ) : (
        <ul>
          {sessionData.exercises.map((ex) => (
            <li key={ex.id}>
              <strong>{ex.name}</strong> – {ex.sets} sets x {ex.reps} reps @ {ex.weight} lbs
              {ex.note && <div>📝 {ex.note}</div>}
              <button onClick={() => deleteExercise(ex.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Add New Exercise</h3>
      <AddExerciseToSessionForm sessionId={id} onExerciseAdded={loadSession} />
    </div>
  );
}
