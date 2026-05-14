"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type WorkoutRow = {
  id: string;
  title: string | null;
  startedAt: string;
  exercises: Array<{ id: string; name: string }>;
};

export default function WorkoutView() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [workout, setWorkout] = useState<WorkoutRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/workouts/${id}`);
        if (!res.ok) throw new Error(`Failed to load workout (${res.status})`);
        const data = await res.json();
        if (!cancelled) setWorkout(data.workout ?? null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function onDelete() {
    if (!confirm("Delete this workout? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(`Failed to delete (${res.status})`);
      // Navigate back to the listing
      router.push("/workout");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!workout) return <div>Not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title">{workout.title ?? "Untitled workout"}</h1>
          <div className="text-sm text-slate-400">{new Date(workout.startedAt).toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => router.push(`/workout/${id}/edit`)}>Edit</button>
          <button className="btn-danger" onClick={onDelete}>Delete</button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300">Exercises</h3>
        <ul className="mt-2 list-disc pl-6 text-white">
          {workout.exercises?.length ? workout.exercises.map((e) => <li key={e.id}>{e.name}</li>) : <li>—</li>}
        </ul>
      </div>
    </div>
  );
}
