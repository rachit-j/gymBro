import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [nextSession, setNextSession] = useState(null);

  useEffect(() => {
    if (session) {
      fetch("/api/workout-sessions")
        .then((res) => res.json())
        .then((data) => {
          const today = new Date();
          const upcoming = data
            .filter((s) => new Date(s.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          if (upcoming.length) setNextSession(upcoming[0]);
        });
    }
  }, [session]);

  if (session) {
    const username = session.user.email.split("@")[0];
    return (
      <div className="card" style={{ padding: "4rem 2rem", marginTop: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Welcome back, {username}!
        </h1>

        {nextSession ? (
          <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            Your next session: <strong>{nextSession.title}</strong><br/>
            on {new Date(nextSession.date).toLocaleDateString()}
          </p>
        ) : (
          <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            You have no upcoming sessions.<br/>
            <Link href="/dashboard/sessions" className="text-violet-600 hover:underline">
              Create one now
            </Link>
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-violet-600 text-white rounded shadow hover:bg-violet-700 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard/calendar"
            className="px-6 py-3 bg-white text-violet-600 border-2 border-violet-600 rounded shadow hover:bg-violet-50 transition"
          >
            View Calendar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", marginTop: "2rem" }}>
      <h1 style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>
        Welcome to gymBro
      </h1>
      <p style={{ fontSize: "1.125rem", color: "var(--color-text)", marginBottom: "2rem" }}>
        Manage, schedule, and track your gym workouts—all in one place.
      </p>

      <Link
        href="/auth/signin"
        className="mr-4 inline-block px-6 py-3 bg-violet-600 text-white rounded shadow hover:bg-violet-700 transition"
      >
        Sign In
      </Link>

      <Link
        href="/auth/register"
        className="inline-block px-6 py-3 bg-white text-violet-600 border-2 border-violet-600 rounded shadow hover:bg-violet-50 transition"
      >
        Sign Up
      </Link>
    </div>
  );
}
