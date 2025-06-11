import { useState, useEffect } from "react";

export default function WorkoutForm({ onWorkoutCreated }) {
  const [workoutList, setWorkoutList] = useState([]);
  const [mode, setMode] = useState("predefined"); // "predefined" or "custom"
  const [formData, setFormData] = useState({
    title: "",
    sets: "",
    reps: "",
    weight: "",
    note: "",
  });
  const [selectedWorkout, setSelectedWorkout] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelect = (e) => {
    const workout = workoutList.find((w) => w.title === e.target.value);
    if (workout) {
      const autofill = autofillByLevel(workout.level || "");
      setFormData({
        title: workout.title,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      onWorkoutCreated();
      setFormData({ title: "", sets: "", reps: "", weight: "", note: "" });
      setSelectedWorkout(null);
    } else {
      alert("Failed to save workout");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}>
      <h3>Add a Workout</h3>

      <label>
        Mode:
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="predefined">Choose from list</option>
          <option value="custom">Create your own</option>
        </select>
      </label>

      {mode === "predefined" ? (
        <div>
          <label>
            Select a workout:
            <select onChange={handleSelect} value={formData.title}>
              <option value="">-- Choose one --</option>
              {workoutList.map((w) => (
                <option key={w.title} value={w.title}>
                  {w.title} ({w.bodyPart} - {w.level})
                </option>
              ))}
            </select>
          </label>

          {selectedWorkout && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", border: "1px solid #eee", background: "#f9f9f9" }}>
              <h4>Workout Info</h4>
              <p><strong>Type:</strong> {selectedWorkout.type}</p>
              <p><strong>Body Part:</strong> {selectedWorkout.bodyPart}</p>
              <p><strong>Level:</strong> {selectedWorkout.level}</p>
              <p><strong>Equipment:</strong> {selectedWorkout.equipment}</p>
              <p><strong>Description:</strong> {selectedWorkout.description}</p>
              <p><strong>Rating:</strong> {selectedWorkout.rating}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label>
            Custom Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Bulgarian Split Squats"
            />
          </label>
        </div>
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
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Add permanent notes or instructions"
        />
      </label>

      <button onClick={handleSubmit} disabled={!formData.title}>
        Save Workout
      </button>
    </div>
  );
}
