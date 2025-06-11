import { useEffect, useState } from "react";

export default function AddExerciseToSessionForm({ sessionId, onExerciseAdded }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [mode, setMode] = useState("predefined");
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    note: "",
  });

  useEffect(() => {
    fetch("/api/workouts/predefined")
      .then((res) => res.json())
      .then((data) => setWorkoutList(data));
  }, []);

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

  const handleSelect = (e) => {
    const workout = workoutList.find((w) => w.title === e.target.value);
    if (workout) {
      const autofill = autofillByLevel(workout.level || "");
      setFormData({
        name: workout.title,
        sets: autofill.sets,
        reps: autofill.reps,
        weight: autofill.weight,
        note: "",
      });
      setSelectedWorkout(workout);
    } else {
      setSelectedWorkout(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      workoutSessionId: sessionId,
    };

    const res = await fetch("/api/workout-sessions/add-exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      onExerciseAdded();
      setFormData({ name: "", sets: "", reps: "", weight: "", note: "" });
      setSelectedWorkout(null);
    } else {
      alert("Failed to add exercise.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Add Exercise to Session</h3>

      <label>
        Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="predefined">Choose from list</option>
          <option value="custom">Create your own</option>
        </select>
      </label>

      {mode === "predefined" ? (
        <>
          <label>
            Select a workout:
            <select onChange={handleSelect} value={formData.name}>
              <option value="">-- Choose one --</option>
              {workoutList.map((w) => (
                <option key={w.title} value={w.title}>
                  {w.title} ({w.bodyPart} - {w.level})
                </option>
              ))}
            </select>
          </label>

          {selectedWorkout && (
            <div style={{ background: "#f9f9f9", padding: "0.75rem", marginTop: "0.5rem" }}>
              <p><strong>Type:</strong> {selectedWorkout.type}</p>
              <p><strong>Body Part:</strong> {selectedWorkout.bodyPart}</p>
              <p><strong>Level:</strong> {selectedWorkout.level}</p>
              <p><strong>Equipment:</strong> {selectedWorkout.equipment}</p>
              <p><strong>Description:</strong> {selectedWorkout.description}</p>
              <p><strong>Rating:</strong> {selectedWorkout.rating}</p>
            </div>
          )}
        </>
      ) : (
        <label>
          Custom Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Farmer's Walk"
          />
        </label>
      )}

      <label>
        Sets:
        <input type="number" name="sets" value={formData.sets} onChange={handleChange} />
      </label>
      <label>
        Reps:
        <input type="number" name="reps" value={formData.reps} onChange={handleChange} />
      </label>
      <label>
        Weight (lbs):
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
      </label>
      <label>
        Notes:
        <textarea name="note" value={formData.note} onChange={handleChange} />
      </label>

      <button onClick={handleSubmit} disabled={!formData.name}>
        Add Exercise
      </button>
    </div>
  );
}
