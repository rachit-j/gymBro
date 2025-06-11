import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function ExercisesPage() {
  const { data: session } = useSession();
  const [allExercises, setAllExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (session) {
      fetch("/api/workouts/predefined")
        .then((res) => res.json())
        .then(setAllExercises);
    }
  }, [session]);

  if (!session) {
    return (
      <div className="card" style={{ textAlign: "center" }}>
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

  // Filter by search term
  const filtered = allExercises.filter((ex) =>
    ex.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paged = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div style={{ margin: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>All Exercises</h1>
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search exercises…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Exercise Grid */}
      {paged.length === 0 ? (
        <p style={{ color: "#6b7280", textAlign: "center" }}>No exercises found.</p>
      ) : (
        <div className="exercise-list">
          {paged.map((ex) => (
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
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>
          <span style={{ alignSelf: "center" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
