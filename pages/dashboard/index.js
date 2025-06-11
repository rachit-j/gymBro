// pages/dashboard/index.js
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (session) {
      fetch("/api/workout-sessions")
        .then((res) => res.json())
        .then(setSessions);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="card" style={{ padding: "2rem", textAlign: "center" }}>
        <p>
          Please{" "}
          <Link href="/auth/signin" className="text-violet-600 hover:underline">
            sign in
          </Link>{" "}
          to view your dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
        Hello, {session.user.email}
      </h2>
      <button
        onClick={() => signOut()}
        style={{
          padding: "0.5rem 1rem",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius)",
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        Sign Out
      </button>

      <h3 style={{ marginBottom: "1rem" }}>Your Workout Sessions</h3>
      {sessions.length === 0 ? (
        <p>
          No sessions yet –{" "}
          <Link
            href="/dashboard/sessions"
            className="text-violet-600 hover:underline"
          >
            create one now
          </Link>
          .
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sessions.map((s) => (
            <li
              key={s.id}
              style={{
                padding: "0.75rem 0",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Link
                href={`/dashboard/sessions/${s.id}`}
                className="text-violet-600 font-medium hover:underline"
              >
                {s.title}
              </Link>{" "}
              — {new Date(s.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
