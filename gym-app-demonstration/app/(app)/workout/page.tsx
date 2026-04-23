// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\(app)\workout\page.tsx
export default function WorkoutPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="title">Workouts</h1>
        <p className="subtitle">Workout logging UI placeholder (exercises, sets, reps, duration).</p>
      </header>

      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Recent workouts</div>
            <div className="text-xs text-slate-400">Placeholder table</div>
          </div>
          <button className="btn-primary">Add workout</button>
        </div>

        <div className="mt-4 h-64 rounded-2xl bg-white/5 border border-white/10" />
      </div>
    </div>
  );
}