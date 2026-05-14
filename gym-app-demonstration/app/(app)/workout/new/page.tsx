"use client";

import NewWorkoutForm from "../../components/NewWorkoutForm";

export default function NewWorkoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white/3 p-8 backdrop-blur">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create workout</h1>
            <p className="mt-1 text-sm text-slate-300">Create a new workout and save it to your database.</p>
          </div>
        </div>

        <div className="mt-6">
          <NewWorkoutForm onClose={() => { /* no-op for page-based form */ }} />
        </div>
      </div>
    </div>
  );
}
