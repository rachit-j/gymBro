import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function WorkoutCalendar() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load all sessions
  useEffect(() => {
    if (session) {
      fetch("/api/workout-sessions")
        .then((res) => res.json())
        .then(setSessions);
    }
  }, [session]);

  // Filter for the chosen day
  const formatDay = (d) => d.toISOString().split("T")[0];
  const todaysSessions = sessions.filter(
    (s) => formatDay(new Date(s.date)) === formatDay(selectedDate)
  );

  return (
    <div style={{ margin: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>Workout Calendar</h1>
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>

      <div className="card" style={{ padding: "2rem", marginTop: "1rem" }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="react-calendar"
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem" }}>
          Sessions on {selectedDate.toDateString()}
        </h2>
        {todaysSessions.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No sessions scheduled.</p>
        ) : (
          <ul className="session-list">
            {todaysSessions.map((s) => (
              <li key={s.id} className="session-item card" style={{ justifyContent: "space-between" }}>
                <Link href={`/dashboard/sessions/${s.id}`} className="session-link">
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
