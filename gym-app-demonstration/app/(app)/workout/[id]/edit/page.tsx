"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function WorkoutEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [exercisesText, setExercisesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/workouts/${id}`);
        if (!res.ok) throw new Error(`Failed to load workout (${res.status})`);
        const data = await res.json();
        if (!cancelled) {
          setTitle(data.workout.title ?? "");
          setExercisesText((data.workout.exercises || []).map((e: any) => e.name).join("\n"));
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  async function onSave(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required");
    try {
      setSaving(true);
      const payload = { title: title.trim(), exercises: exercisesText.split('\n').map(s => s.trim()).filter(s => s.length > 0) };
      const res = await fetch(`/api/workouts/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Failed to update (${res.status})`);
      const data = await res.json();
      // Navigate back to listing and highlight
      router.push(`/workout?new=${data.workout.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <label className="text-sm text-slate-300">Title</label>
        <input className="input mt-1 w-full" value={title} onChange={(e) => setTitle(e.target.value)} disabled={saving} />
      </div>
      <div>
        <label className="text-sm text-slate-300">Exercises (one per line)</label>
        <textarea className="input mt-1 w-full h-36" value={exercisesText} onChange={(e) => setExercisesText(e.target.value)} disabled={saving} />
      </div>
      {error ? <div className="text-sm text-red-300">{error}</div> : null}
      <div className="flex gap-2">
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" className="btn-ghost" onClick={() => router.push(`/workout/${id}`)} disabled={saving}>Cancel</button>
      </div>
    </form>
  );
}
