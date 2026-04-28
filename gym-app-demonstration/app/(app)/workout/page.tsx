"use client";

import { useEffect, useMemo, useState } from "react";

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

  async function onAddWorkout() {
    try {
      setCreating(true);
      setError(null);
      const res = await fetch("/api/workouts", { method: "POST" });
      if (!res.ok) throw new Error(`Failed to create workout (${res.status})`);
      const data = (await res.json()) as { workout: WorkoutRow };
      setWorkouts((prev) => [data.workout, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create workout");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="title">Workouts</h1>
        <p className="subtitle">Create workouts that persist in your database.</p>
      </header>

      <div className="card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Recent workouts</div>
            <div className="text-xs text-slate-400">{workoutCountLabel}</div>
          </div>
          <button className="btn-primary" onClick={onAddWorkout} disabled={creating}>
            {creating ? "Adding…" : "Add workout"}
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
                <tr key={w.id} className="border-b border-white/5 last:border-b-0">
                  <td className="px-4 py-3 text-white">
                    {w.title ?? "Untitled workout"}
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
    </div>
  );
}