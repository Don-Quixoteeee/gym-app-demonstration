"use client";

import { useState } from "react";
import NewWorkoutForm from "./NewWorkoutForm";

export default function NewWorkoutModal({ onCreated }: { onCreated?: (w: any) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(37,99,235,.28)] hover:bg-blue-500"
      >
        New workout
      </button>

      {open ? (
        // full-viewport overlay; allow scrolling if content is taller than viewport
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50">
          <div className="flex min-h-full items-start justify-center p-6">
            <div className="w-full max-w-2xl rounded-xl bg-slate-900 p-6 shadow-lg max-h-[calc(100vh-3rem)] overflow-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">New workout</h3>
                <button className="text-slate-400" onClick={() => setOpen(false)} aria-label="Close">✕</button>
              </div>
              <div className="mt-4">
                <NewWorkoutForm
                  onCreated={(w) => {
                    onCreated?.(w);
                  }}
                  onClose={() => setOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
