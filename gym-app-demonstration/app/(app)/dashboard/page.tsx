import { getStats } from "@/lib/stats";

export default async function DashboardPage() {
  const stats = await getStats();

  const kpis = [
    {
      label: "Active members",
      value: stats.kpis.activeMembers.toLocaleString(),
      delta: "Persisted",
    },
    {
      label: "Workouts (7d)",
      value: stats.kpis.workoutsLast7.toLocaleString(),
      delta: "Last 7 days",
    },
    {
      label: "Workouts (30d)",
      value: stats.kpis.workoutsLast30.toLocaleString(),
      delta: "Last 30 days",
    },
    {
      label: "Workouts (all)",
      value: stats.kpis.workoutsTotal.toLocaleString(),
      delta: "All time",
    },
  ];

  const maxCount = Math.max(1, ...stats.series.workoutsLast7ByDay.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">
          High-level view of activity pulled from your database.
        </p>
      </div>

      {/* KPI grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_50px_rgba(0,0,0,.25)] backdrop-blur-xl"
          >
            <div className="text-xs font-medium text-slate-400">{k.label}</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              {k.value}
            </div>
            <div className="mt-1 text-xs text-slate-400">{k.delta}</div>
          </div>
        ))}
      </section>

      {/* Panels */}
      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl xl:col-span-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Weekly activity</div>
              <div className="mt-1 text-xs text-slate-400">Workouts created per day</div>
            </div>
            <div className="text-xs text-slate-400">Last 7 days</div>
          </div>

      <div className="mt-4 grid h-72 grid-cols-7 items-end gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4">
        {stats.series.workoutsLast7ByDay.map((d) => (
          <div key={d.date} className="flex h-full flex-col items-center justify-end gap-2">
            <div
              className="w-full rounded-lg bg-sky-400/60"
              style={{ height: `${Math.max(6, Math.round((d.count / maxCount) * 100))}%` }}
              title={`${d.date}: ${d.count}`}
            />
            <div className="text-[10px] text-slate-400">
              {new Date(d.date + "T00:00:00Z").toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="text-sm font-semibold text-white">Next actions</div>
          <p className="mt-1 text-xs text-slate-400">
            Quick wins to improve retention.
          </p>

          <div className="mt-4 space-y-3">
            <Action title="Reach out to 12 at-risk members" meta="No visits in 14+ days" />
            <Action title="Create a beginner re-entry plan" meta="For new signups" />
            <Action title="Post weekly challenge" meta="Boost engagement" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Action({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-400">{meta}</div>
    </div>
  );
}