// pages/dashboard/sessions.js
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

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
    if (!newSession.title || !newSession.date) return;
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
    <div>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem 0" }}>
        <h1 style={{ fontSize: "1.75rem" }}>Workout Sessions</h1>
      </div>

      {/* Create New Session */}
      <div className="card form-card">
        <h2>Create New Session</h2>
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g. Leg Day"
          value={newSession.title}
          onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
        />

        <label>Date</label>
        <input
          type="date"
          value={newSession.date}
          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
        />

        <label>Optional note</label>
        <textarea
          rows={2}
          placeholder="Notes for this session"
          value={newSession.note}
          onChange={(e) => setNewSession({ ...newSession, note: e.target.value })}
        />

        <button className="btn-primary" onClick={createSession}>
          Create Session
        </button>
      </div>

      {/* Sessions List */}
      <h2 style={{ marginTop: "2rem", fontSize: "1.5rem" }}>Your Sessions</h2>
      {sessions.length === 0 ? (
        <p style={{ color: "#6b7280" }}>No sessions yet. Create your first one above!</p>
      ) : (
        <div className="session-list">
          {sessions.map((s) => (
            <div key={s.id} className="session-item card">
              <div className="info">
                <Link href={`/dashboard/sessions/${s.id}`} className="session-link">
                  <h3>{s.title}</h3>
                </Link>
                <p>{new Date(s.date).toLocaleDateString()}</p>
                {s.note && <p>📝 {s.note}</p>}
                <p>🏋️ {s.exercises.length} exercise(s)</p>
              </div>
              <button
                className="btn-danger"
                onClick={async () => {
                  await fetch(`/api/workout-sessions/${s.id}`, { method: "DELETE" });
                  loadSessions();
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
