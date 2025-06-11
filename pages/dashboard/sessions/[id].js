// pages/dashboard/sessions/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function SessionDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const [sessionData, setSessionData] = useState(null);
  const [workoutList, setWorkoutList] = useState([]);
  const [mode, setMode] = useState("predefined"); // or "custom"
  const [newExercise, setNewExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    note: "",
  });

  // Load the session details
  const loadSession = async () => {
    const res = await fetch(`/api/workout-sessions/${id}`);
    setSessionData(await res.json());
  };

  // Load predefined workouts from CSV
  useEffect(() => {
    fetch("/api/workouts/predefined")
      .then((r) => r.json())
      .then(setWorkoutList);
  }, []);

  // Reload when session id is ready
  useEffect(() => {
    if (id) loadSession();
  }, [id]);

  // Autofill helper
  const autofillByLevel = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return { sets: 3, reps: 10, weight: 20 };
      case "intermediate":
        return { sets: 4, reps: 10, weight: 40 };
      case "advanced":
        return { sets: 5, reps: 8, weight: 60 };
      default:
        return { sets: "", reps: "", weight: "" };
    }
  };

  // Add or update session exercise list
  const addExercise = async () => {
    if (!newExercise.name) return;
    await fetch("/api/workout-sessions/add-exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newExercise, workoutSessionId: id }),
    });
    setNewExercise({ name: "", sets: "", reps: "", weight: "", note: "" });
    loadSession();
  };

  if (!sessionData) {
    return <div className="card" style={{ textAlign: "center" }}>Loading…</div>;
  }

  return (
    <div style={{ margin: "2rem" }}>
      {/* Session header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>{sessionData.title}</h1>
      </div>

      {/* Session info */}
      <div className="card" style={{ marginTop: "1rem" }}>
        <p><strong>Date:</strong> {new Date(sessionData.date).toLocaleDateString()}</p>
        <p><strong>Note:</strong> {sessionData.note || "(none)"}</p>

        <h2 style={{ marginTop: "1.5rem", fontSize: "1.5rem" }}>Exercises</h2>
        {sessionData.exercises.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No exercises yet</p>
        ) : (
          <div className="session-list">
            {sessionData.exercises.map((ex) => (
              <div key={ex.id} className="session-item">
                <div className="info">
                  <h3>{ex.name}</h3>
                  <p>Sets: {ex.sets}, Reps: {ex.reps}, Weight: {ex.weight} lbs</p>
                  {ex.note && <p>📝 {ex.note}</p>}
                </div>
                <button
                  className="btn-danger"
                  onClick={async () => {
                    await fetch(`/api/exercises/${ex.id}`, { method: "DELETE" });
                    loadSession();
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Exercise */}
        <h2 style={{ marginTop: "2rem", fontSize: "1.5rem" }}>Add Exercise to Session</h2>
        <div className="form-card" style={{ marginTop: "1rem" }}>
          <label>Mode:</label>
          <select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setNewExercise({ name: "", sets: "", reps: "", weight: "", note: "" });
            }}
            style={{ display: "block", marginBottom: "1rem" }}
          >
            <option value="predefined">Choose from list</option>
            <option value="custom">Create your own</option>
          </select>

          {mode === "predefined" ? (
            <>
              <label>Select a workout:</label>
              <select
                value={newExercise.name}
                onChange={(e) => {
                  const w = workoutList.find((w) => w.title === e.target.value);
                  const auto = autofillByLevel(w?.level || "");
                  setNewExercise({
                    name: w.title,
                    sets: auto.sets,
                    reps: auto.reps,
                    weight: auto.weight,
                    note: "",
                  });
                }}
                style={{ display: "block", marginBottom: "0.75rem", width: "100%" }}
              >
                <option value="">-- Choose one --</option>
                {workoutList.map((w) => (
                  <option key={w.title} value={w.title}>
                    {w.title} ({w.bodyPart} - {w.level})
                  </option>
                ))}
              </select>
            </>
          ) : (
            <>
              <label>Custom Name:</label>
              <input
                type="text"
                placeholder="e.g. Farmer’s Walk"
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              />
            </>
          )}

          {mode === "predefined" && newExercise.name && (
            <div style={{ margin: "0.5rem 0", padding: "0.5rem", background: "#fafafa", borderRadius: "var(--radius)" }}>
              <p><strong>Suggested:</strong></p>
              <p>Sets: {newExercise.sets}, Reps: {newExercise.reps}, Weight: {newExercise.weight} lbs</p>
            </div>
          )}

          <label>Sets:</label>
          <input
            type="number"
            value={newExercise.sets}
            onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
          />

          <label>Reps:</label>
          <input
            type="number"
            value={newExercise.reps}
            onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
          />

          <label>Weight (lbs):</label>
          <input
            type="number"
            value={newExercise.weight}
            onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
          />

          <label>Notes:</label>
          <textarea
            rows={2}
            placeholder="Optional note"
            value={newExercise.note}
            onChange={(e) => setNewExercise({ ...newExercise, note: e.target.value })}
          />

          <button
            className="btn-primary"
            onClick={addExercise}
            style={{ marginTop: "0.5rem" }}
          >
            Add Exercise
          </button>
        </div>
      </div>
    </div>
  );
}
