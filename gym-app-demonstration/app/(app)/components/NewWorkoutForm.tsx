"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type WorkoutRow = {
  id: string;
  title: string | null;
  startedAt: string;
  exercises: Array<{ id: string; name: string }>;
};

export default function NewWorkoutForm({ onCreated, onClose }: { onCreated?: (w: WorkoutRow) => void; onClose?: () => void; }) {
  const [titleInput, setTitleInput] = useState("");
  const [exercisesInput, setExercisesInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const router = useRouter();

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setFormErrors(null);
    if (!titleInput.trim()) {
      setFormErrors("Title is required");
      return;
    }

    try {
      setCreating(true);
      const payload = {
        title: titleInput.trim(),
        exercises: exercisesInput
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      };

      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Failed to create workout (${res.status})`);
      }

      const data = (await res.json()) as { workout: WorkoutRow };
      setTitleInput("");
      setExercisesInput("");
      onCreated?.(data.workout);
      onClose?.();

      // navigate to workout page with new id so the page can highlight it
      try {
        router.push(`/workout?new=${data.workout.id}`);
      } catch (e) {
        // ignore navigation errors in non-router contexts
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create workout";
      setFormErrors(msg);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => { setFormErrors(null); toastTimer.current = null; }, 5000);
    } finally {
      setCreating(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-6">
      <div className="grid gap-2 sm:grid-cols-3 sm:items-end">
        <label className="text-sm text-slate-300">Title (required)</label>
        <input
          className="sm:col-span-2 input"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Morning strength session"
          required
          disabled={creating}
        />
        <label className="text-sm text-slate-300">Exercises (one per line)</label>
        <textarea
          className="sm:col-span-2 input h-24"
          value={exercisesInput}
          onChange={(e) => setExercisesInput(e.target.value)}
          placeholder="Squat\nBench press\nDeadlift"
          disabled={creating}
        />
        <div />
        <div className="flex items-center gap-3">
          <button className="btn-primary" type="submit" disabled={creating}>
            {creating ? (
              <>
                <svg className="inline-block h-4 w-4 animate-spin mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Saving…
              </>
            ) : (
              "Save workout"
            )}
          </button>
          <button type="button" className="btn-ghost" onClick={() => { setTitleInput(""); setExercisesInput(""); }} disabled={creating}>
            Clear
          </button>
        </div>
      </div>
      {formErrors ? <div className="mt-2 text-sm text-red-300">{formErrors}</div> : null}
    </form>
  );
}
