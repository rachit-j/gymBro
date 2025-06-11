import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";

export default function WorkoutCalendar() {
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetch("/api/workout-sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  const sessionsForDay = sessions.filter(s =>
    new Date(s.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Workout Calendar</h1>
      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <h2>Sessions on {selectedDate.toDateString()}</h2>
      {sessionsForDay.length === 0 ? (
        <p>No sessions</p>
      ) : (
        <ul>
          {sessionsForDay.map((s) => (
            <li key={s.id}>
              <a href={`/dashboard/sessions/${s.id}`}>{s.title}</a> — {s.note}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
