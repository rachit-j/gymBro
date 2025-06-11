// pages/index.js
import { useSession } from "next-auth/react";
import { useRouter }  from "next/router";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
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

  const go = (path) => () => router.push(path);

  if (session) {
    const username = session.user.email.split("@")[0];
    return (
      <div
        className="card"
        style={{ padding: "4rem 2rem", marginTop: "2rem", textAlign: "center" }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Welcome back, {username}!
        </h1>

        {nextSession ? (
          <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            Your next session: <strong>{nextSession.title}</strong>
            <br />
            on {new Date(nextSession.date).toLocaleDateString()}
          </p>
        ) : (
          <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
            You have no upcoming sessions.
            <br />
            <button
              onClick={go("/dashboard/sessions")}
              className="btn-secondary"
              style={{ marginTop: "0.5rem" }}
            >
              Create one now
            </button>
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button onClick={go("/dashboard")} className="btn-primary">
            Go to Dashboard
          </button>
          <button onClick={go("/dashboard/calendar")} className="btn-secondary">
            View Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{ textAlign: "center", padding: "4rem 2rem", marginTop: "2rem" }}
    >
      <h1 style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>
        Welcome to gymBro
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text)",
          marginBottom: "2rem",
        }}
      >
        Manage, schedule, and track your gym workouts—all in one place.
      </p>

      <button onClick={go("/auth/signin")} className="btn-primary" style={{ marginRight: "1rem" }}>
        Sign In
      </button>
      <button onClick={go("/auth/register")} className="btn-secondary">
        Sign Up
      </button>
    </div>
  );
}
