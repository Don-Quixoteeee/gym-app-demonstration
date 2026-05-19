import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

function formatNumber(n: number) {
  return n.toLocaleString?.() ?? String(n);
}

type WorkoutWithExercises = Prisma.WorkoutGetPayload<{
  include: { exercises: true };
}>;

export default async function AnalyticsPage() {
  const now = new Date();
  const last30 = new Date(now);
  last30.setDate(now.getDate() - 30);

  // Load workouts from the last 30 days and include exercises for metric calculations.
  const recent: WorkoutWithExercises[] = await prisma.workout.findMany({
    where: { startedAt: { gte: last30 } },
    include: { exercises: true },
    orderBy: { startedAt: "desc" },
  });

  // Metric A: workouts per week (last 4 weeks)
  const msWeek = 7 * 24 * 60 * 60 * 1000;
  const weeks = [0, 1, 2, 3].map((i) => ({ label: i === 0 ? "This week" : `${i} week${i > 1 ? "s" : ""} ago`, count: 0 }));
  for (const w of recent) {
    const diff = now.getTime() - new Date(w.startedAt).getTime();
    const weeksAgo = Math.floor(diff / msWeek);
    if (weeksAgo >= 0 && weeksAgo < 4) weeks[weeksAgo].count++;
  }

  // Metric B: average exercises per workout (last 30 days)
  const totalWorkouts = recent.length;
  const totalExercises = recent.reduce((sum: number, r: WorkoutWithExercises) => sum + (r.exercises?.length ?? 0), 0);
  const avgExercises = totalWorkouts ? totalExercises / totalWorkouts : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="title">Analytics</h1>
        <p className="subtitle">Simple operational metrics based on recent data.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <h2 className="text-lg font-semibold text-white">Workouts per week (last 4 weeks)</h2>
          <div className="mt-3 flex flex-col gap-2">
            {weeks.map((w) => (
              <div key={w.label} className="flex items-center justify-between">
                <div className="text-sm text-slate-300">{w.label}</div>
                <div className="text-xl font-medium text-white">{formatNumber(w.count)}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-slate-400">
            Explanation: counts workouts whose <code>startedAt</code> falls within each week bucket. Data queried from the <code>workout</code> table using Prisma and filtered by <code>startedAt &gt;= last 30 days</code>.
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Verification: the query uses Prisma. You can cross-check rows in the DB or run the seed locally.
            <pre className="mt-2 rounded bg-white/3 p-2 text-xs text-slate-200"><code>{`prisma.workout.findMany({ where: { startedAt: { gte: last30 } }, include: { exercises: true } })`}</code></pre>
          </div>
        </div>

        <div className="card p-4">
          <h2 className="text-lg font-semibold text-white">Average exercises per workout (30 days)</h2>
          <div className="mt-3">
            <div className="text-4xl font-bold text-white">{formatNumber(Math.round(avgExercises * 10) / 10)}</div>
            <div className="mt-2 text-sm text-slate-300">Based on {formatNumber(totalWorkouts)} workout{totalWorkouts === 1 ? "" : "s"} in the last 30 days.</div>
          </div>
          <div className="mt-3 text-sm text-slate-400">
            Explanation: for each workout we count exercises and compute the mean. Useful to track session density and programming volume.
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Verification: compare the total exercises ({formatNumber(totalExercises)}) and the total workouts ({formatNumber(totalWorkouts)}) returned by the Prisma query above.
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold text-slate-300">Notes</h3>
        <ul className="mt-2 list-disc pl-6 text-sm text-slate-400">
          <li>Metrics are computed from the canonical <code>workout</code> and <code>exercise</code> tables.</li>
          <li>Time windows are relative to server time; timezone differences can affect which week a workout is assigned to.</li>
          <li>For production analytics we recommend materialized counters or scheduled ETL jobs for performance and accuracy at scale.</li>
        </ul>
      </div>
    </div>
  );
}
