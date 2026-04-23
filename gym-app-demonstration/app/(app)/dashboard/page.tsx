// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\(app)\dashboard\page.tsx
const kpis = [
  { label: "Active members", value: "1,204", delta: "+4.2% WoW" },
  { label: "Retention", value: "91%", delta: "Last 30 days" },
  { label: "Avg. visits", value: "2.6 / wk", delta: "Per member" },
  { label: "Churn risk", value: "12", delta: "Needs outreach" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Default</h1>
        <p className="mt-1 text-sm text-slate-400">
          High-level view of engagement and retention (demo data).
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
              <div className="mt-1 text-xs text-slate-400">Placeholder chart</div>
            </div>
            <div className="text-xs text-slate-400">Last 7 days</div>
          </div>

          <div className="mt-4 h-72 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent" />
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