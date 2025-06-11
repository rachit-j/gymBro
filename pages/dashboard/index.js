import { getSession, useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import WorkoutForm from "../../components/WorkoutForm";

export default function Dashboard() {
  const { data: session } = useSession();
  const [workouts, setWorkouts] = useState([]);

  const loadWorkouts = () => {
    fetch("/api/workouts")
      .then((res) => res.json())
      .then((data) => setWorkouts(data));
  };

  useEffect(() => {
    if (session) loadWorkouts();
  }, [session]);

  if (!session) return <div>Loading...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {session.user.email}</h1>
      <button onClick={() => signOut()}>Sign Out</button>

      <h2>Your Workouts</h2>
      {workouts.length === 0 ? (
        <p>No workouts yet</p>
      ) : (
        <ul>
          {workouts.map((workout) => (
            <li key={workout.id}>
              <strong>{workout.title}</strong> on{" "}
              {new Date(workout.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}

      <WorkoutForm onWorkoutCreated={loadWorkouts} />
    </div>
  );
}
