// pages/dashboard/exercises.js
import { useEffect, useState } from "react";
import { useSession, signOut }    from "next-auth/react";
import { useRouter }               from "next/router";
import Link                        from "next/link";

export default function ExercisesPage() {
  const { data: session } = useSession();
  const router            = useRouter();
  const { tab }           = router.query;
  const activeTab         = tab === "custom" ? "custom" : "predefined";

  const [predefined, setPredefined] = useState([]);
  const [custom, setCustom]         = useState([]);

  useEffect(() => {
    if (!session) return;
    // load CSV exercises
    fetch("/api/workouts/predefined")
      .then((r) => r.json())
      .then(setPredefined);
    // load user’s custom exercises
    fetch("/api/custom-exercises")
      .then((r) => r.json())
      .then(setCustom);
  }, [session]);

  if (!session) {
    return (
      <div className="card" style={{ textAlign: "center", margin: "2rem auto" }}>
        <p>
          Please{" "}
          <Link href="/auth/signin" className="text-violet-600 hover:underline">
            sign in
          </Link>{" "}
          to view exercises.
        </p>
      </div>
    );
  }

  const switchTab = (t) => {
    router.push(
      { pathname: "/dashboard/exercises", query: { tab: t } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div style={{ margin: "2rem" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h1 style={{ fontSize: "2rem" }}>Exercises</h1>
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-header">
        <button
          className={activeTab === "predefined" ? "active" : ""}
          onClick={() => switchTab("predefined")}
        >
          Predefined
        </button>
        <button
          className={activeTab === "custom" ? "active" : ""}
          onClick={() => switchTab("custom")}
        >
          My Custom
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "predefined" ? (
        <div className="exercise-list">
          {predefined.map((ex) => (
            <div key={ex.title} className="exercise-card">
              <h3>{ex.title}</h3>
              <p><strong>Body Part:</strong> {ex.bodyPart}</p>
              <p><strong>Equipment:</strong> {ex.equipment}</p>
              <p><strong>Level:</strong> {ex.level}</p>
              <p><strong>Rating:</strong> {ex.rating}</p>
              <p style={{ marginTop: "0.5rem", color: "#4b5563" }}>
                {ex.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {custom.length === 0 ? (
            <p style={{ color: "#6b7280", marginTop: "1rem" }}>
              You have no custom exercises yet.
            </p>
          ) : (
            <div className="session-list">
              {custom.map((ex) => (
                <div key={ex.id} className="session-item card" style={{ justifyContent: "space-between" }}>
                  <div className="info">
                    <h3>{ex.name}</h3>
                    <p>
                      Sets: {ex.defaultSets ?? "—"}, Reps: {ex.defaultReps ?? "—"}, Weight: {ex.defaultWeight ?? "—"}
                    </p>
                    {ex.note && <p>📝 {ex.note}</p>}
                  </div>
                  {/* You can add Edit/Delete here */}
                </div>
              ))}
            </div>
          )}

          <Link
            href="/dashboard/exercises-manager"
            className="btn-primary"
            style={{ marginTop: "1rem", display: "inline-block" }}
          >
            Manage Custom Exercises
          </Link>
        </>
      )}
    </div>
  );
}
