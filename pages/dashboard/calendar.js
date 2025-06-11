// pages/dashboard/calendar.js
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function WorkoutCalendar() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load all sessions once user is authenticated
  useEffect(() => {
    if (session) {
      fetch("/api/workout-sessions")
        .then((res) => res.json())
        .then(setSessions);
    }
  }, [session]);

  // Helper to compare two dates in local time
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  // Filter for the chosen day
  const todaysSessions = sessions.filter((s) =>
    isSameDay(new Date(s.date), selectedDate)
  );

  return (
    <div style={{ margin: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Workout Calendar</h1>
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>

      {/* Calendar Card */}
      <div className="card" style={{ padding: "2rem", marginTop: "1rem" }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="react-calendar"
        />
      </div>

      {/* Sessions List */}
      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>
          Sessions on {selectedDate.toDateString()}
        </h2>
        {todaysSessions.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No sessions scheduled.</p>
        ) : (
          <ul className="session-list">
            {todaysSessions.map((s) => (
              <li
                key={s.id}
                className="session-item card"
                style={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Link
                  href={`/dashboard/sessions/${s.id}`}
                  className="session-link"
                >
                  {s.title}
                </Link>
                <span>📝 {s.exercises.length} exercise(s)</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
