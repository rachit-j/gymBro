// pages/dashboard/exercises-manager.js
import { useEffect, useState } from "react";
import { useSession, signOut }    from "next-auth/react";
import Link                        from "next/link";

export default function ExercisesManager() {
  const { data: session } = useSession();
  const [list, setList]   = useState([]);
  const [form, setForm]   = useState({
    name: "", defaultSets: "", defaultReps: "", defaultWeight: "", note: ""
  });
  const [editing, setEditing] = useState(null);

  // Load custom exercises
  const load = async () => {
    const res = await fetch("/api/custom-exercises");
    setList(await res.json());
  };

  useEffect(() => {
    if (session) load();
  }, [session]);

  // Create or update
  const save = async () => {
    const url = editing
      ? `/api/custom-exercises/${editing}`
      : `/api/custom-exercises`;
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name:"", defaultSets:"", defaultReps:"", defaultWeight:"", note:"" });
    setEditing(null);
    load();
  };

  // Delete
  const remove = async (id) => {
    await fetch(`/api/custom-exercises/${id}`, { method: "DELETE" });
    load();
  };

  if (!session) {
    return (
      <div className="card" style={{ textAlign: "center", margin: "2rem auto" }}>
        <p>
          Please{" "}
          <Link href="/auth/signin" className="text-violet-600 hover:underline">
            sign in
          </Link>{" "}
          to manage exercises.
        </p>
      </div>
    );
  }

  return (
    <div style={{ margin: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>Manage Custom Exercises</h1>
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>

      {/* Form */}
      <div className="card form-card" style={{ marginTop: "1rem" }}>
        <h2>{editing ? "Edit" : "Add"} Exercise</h2>

        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Bulgarian Split Squat"
        />

        <label>Default Sets</label>
        <input
          type="number"
          value={form.defaultSets}
          onChange={(e) => setForm({ ...form, defaultSets: e.target.value })}
        />

        <label>Default Reps</label>
        <input
          type="number"
          value={form.defaultReps}
          onChange={(e) => setForm({ ...form, defaultReps: e.target.value })}
        />

        <label>Default Weight</label>
        <input
          type="number"
          value={form.defaultWeight}
          onChange={(e) => setForm({ ...form, defaultWeight: e.target.value })}
        />

        <label>Notes</label>
        <textarea
          rows={2}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />

        <button className="btn-primary" onClick={save}>
          {editing ? "Save Changes" : "Add Exercise"}
        </button>
        {editing && (
          <button
            className="btn-secondary"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => {
              setEditing(null);
              setForm({ name:"", defaultSets:"", defaultReps:"", defaultWeight:"", note:"" });
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* List */}
      <h2 style={{ marginTop: "2rem", fontSize: "1.5rem" }}>Your Exercises</h2>
      {list.length === 0 ? (
        <p style={{ color: "#6b7280" }}>You haven’t added any custom exercises yet.</p>
      ) : (
        <div className="session-list">
          {list.map((ex) => (
            <div key={ex.id} className="session-item card" style={{ justifyContent: "space-between" }}>
              <div className="info">
                <h3>{ex.name}</h3>
                <p>
                  Sets: {ex.defaultSets ?? "—"}, Reps: {ex.defaultReps ?? "—"}, Weight: {ex.defaultWeight ?? "—"}
                </p>
                {ex.note && <p>📝 {ex.note}</p>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button className="btn-secondary" onClick={() => {
                  setEditing(ex.id);
                  setForm({
                    name: ex.name,
                    defaultSets: ex.defaultSets ?? "",
                    defaultReps: ex.defaultReps ?? "",
                    defaultWeight: ex.defaultWeight ?? "",
                    note: ex.note ?? "",
                  });
                }}>
                  Edit
                </button>
                <button className="btn-danger" onClick={() => remove(ex.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
