import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function WorkoutSessionsPage() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState([]);
  const [newSession, setNewSession] = useState({ title: "", date: "", note: "" });

  const loadSessions = async () => {
    const res = await fetch("/api/workout-sessions");
    const data = await res.json();
    setSessions(data);
  };

  useEffect(() => {
    if (session) loadSessions();
  }, [session]);

  const createSession = async () => {
    const res = await fetch("/api/workout-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSession),
    });
    if (res.ok) {
      await loadSessions();
      setNewSession({ title: "", date: "", note: "" });
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Workout Sessions</h1>
      <button onClick={() => signOut()}>Sign Out</button>

      <h2>Create New Session</h2>
      <input
        type="text"
        placeholder="Title"
        value={newSession.title}
        onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
      />
      <input
        type="date"
        value={newSession.date}
        onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
      />
      <textarea
        placeholder="Optional note"
        value={newSession.note}
        onChange={(e) => setNewSession({ ...newSession, note: e.target.value })}
      />
      <button onClick={createSession}>Create</button>

      <h2>Sessions</h2>
      {sessions.map((s) => (
        <div key={s.id} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3>
                <a href={`/dashboard/sessions/${s.id}`}>
                  {s.title}
                </a>
              </h3>
            </div>
            <button
              onClick={async () => {
                await fetch(`/api/workout-sessions/${s.id}`, { method: "DELETE" });
                await loadSessions();
              }}
              style={{ background: "red", color: "white" }}
            >
              Delete
            </button>
          </div>



          <p>{new Date(s.date).toLocaleDateString()}</p>
          <p>{s.note}</p>
          <p>{s.exercises.length} exercises</p>
        </div>
      ))}
    </div>
  );
}
