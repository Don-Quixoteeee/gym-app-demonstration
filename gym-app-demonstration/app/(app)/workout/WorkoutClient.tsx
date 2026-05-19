import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";


type WorkoutRow = {
  id: string;
  title: string | null;
  startedAt: string;
  exercises: Array<{ id: string; name: string }>;
};

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [newWorkoutId, setNewWorkoutId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/workouts", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load workouts (${res.status})`);
        const data = (await res.json()) as { workouts: WorkoutRow[] };
        if (!cancelled) setWorkouts(data.workouts);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load workouts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const workoutCountLabel = useMemo(() => {
    if (loading) return "Loading…";
    return `${workouts.length} workout${workouts.length === 1 ? "" : "s"}`;
  }, [loading, workouts.length]);

  // Form state (page form removed; modal handles creation)
  const searchParams = useSearchParams();

  async function onAddWorkout() {
    try {
      setCreating(true);
      setError(null);
      const res = await fetch("/api/workouts", { method: "POST" });
      if (!res.ok) throw new Error(`Failed to create workout (${res.status})`);
      const data = (await res.json()) as { workout: WorkoutRow };
      setWorkouts((prev) => [data.workout, ...prev]);
      // Visual feedback: highlight and scroll the new row, show success toast
      setNewWorkoutId(data.workout.id);
      // Wait a tick for row to render, then scroll
      setTimeout(() => {
        const el = rowRefs.current[data.workout.id];
        if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      setToast("Workout created");
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => {
        setToast(null);
        setNewWorkoutId(null);
        toastTimer.current = null;
      }, 3000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create workout";
      setError(msg);
      setToast(msg);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => {
        setToast(null);
        toastTimer.current = null;
      }, 5000);
    } finally {
      setCreating(false);
    }
  }

  // If modal redirected with ?new=<id>, highlight that workout
  useEffect(() => {
    const newId = searchParams?.get("new");
    if (newId) {
      setNewWorkoutId(newId);
      // clear highlight after a short delay
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => {
        setNewWorkoutId(null);
        toastTimer.current = null;
      }, 3500);
      // scroll after a tick (rows will render from load effect)
      setTimeout(() => {
        const el = rowRefs.current[newId];
        if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="title">Workouts</h1>
        <p className="subtitle">Create workouts that persist in your database.</p>
      </header>

      <div className="card p-5">
  {/* The workout creation UI moved to the top-right "New workout" modal; quick add button remains below. */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Recent workouts</div>
            <div className="text-xs text-slate-400">{workoutCountLabel}</div>
          </div>
          <button className="btn-primary" onClick={onAddWorkout} disabled={creating}>
            {creating ? (
              <>
                <svg className="inline-block h-4 w-4 animate-spin mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Adding…
              </>
            ) : (
              "Add workout"
            )}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Started</th>
                <th className="px-4 py-3 font-medium">Exercises</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((w) => (
                <tr
                  key={w.id}
                  ref={(el) => { rowRefs.current[w.id] = el; return; }}
                  className={
                    "border-b border-white/5 last:border-b-0 transition-shadow duration-200 " +
                    (newWorkoutId === w.id ? "bg-green-500/8 ring-1 ring-green-400/20" : "")
                  }
                >
                  <td className="px-4 py-3 text-white">
                    <div className="flex items-center justify-between">
                      <div>{w.title ?? "Untitled workout"}</div>
                      <div className="ml-4 flex items-center gap-2">
                        <a href={`/workout/${w.id}`} className="text-xs text-slate-300 hover:underline">View</a>
                        <a href={`/workout/${w.id}/edit`} className="text-xs text-slate-300 hover:underline">Edit</a>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this workout?")) return;
                            try {
                              const res = await fetch(`/api/workouts/${w.id}`, { method: "DELETE" });
                              // Treat 204 or 404 as success (idempotent delete)
                              if (res.status !== 204 && res.status !== 404) throw new Error(`Failed to delete (${res.status})`);
                              setWorkouts((prev) => prev.filter((x) => x.id !== w.id));
                              setToast("Workout deleted");
                              if (toastTimer.current) window.clearTimeout(toastTimer.current);
                              toastTimer.current = window.setTimeout(() => { setToast(null); toastTimer.current = null; }, 3000);
                            } catch (e) {
                              const msg = e instanceof Error ? e.message : "Failed to delete";
                              setError(msg);
                            }
                          }}
                          className="text-xs text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(w.startedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {w.exercises?.length ? w.exercises.map((e) => e.name).join(", ") : "—"}
                  </td>
                </tr>
              ))}
              {!loading && workouts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                    No workouts yet. Click “Add workout” to create your first one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      {/* Toast */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-6 z-50 w-auto max-w-xs rounded-lg bg-slate-900/90 px-4 py-3 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}