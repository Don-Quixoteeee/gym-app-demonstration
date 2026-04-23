// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\(app)\ai\page.tsx
export default function AIPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="title">AI Coach</h1>
        <p className="subtitle">AI insights placeholder (recommendations + churn risk).</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="card p-5">
          <div className="text-sm font-semibold">Insights</div>
          <div className="mt-3 space-y-3">
            <Insight variant="warn" title="Churn risk detected" body="12 members have 0 visits in 14+ days." />
            <Insight variant="info" title="Program suggestion" body="Offer a 3-day re-entry plan to re-activate members." />
          </div>
        </div>

        <div className="card p-5">
          <div className="text-sm font-semibold">Ask the coach</div>
          <p className="mt-1 text-xs text-slate-400">UI placeholder for a prompt + response.</p>
          <div className="mt-4 h-40 rounded-2xl bg-white/5 border border-white/10" />
          <div className="mt-3 flex gap-2">
            <input className="input" placeholder="e.g., Make a 4-week beginner strength plan" />
            <button className="btn-primary whitespace-nowrap">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Insight({
  variant,
  title,
  body,
}: {
  variant: "warn" | "info";
  title: string;
  body: string;
}) {
  const styles =
    variant === "warn"
      ? "border-amber-500/25 bg-amber-500/10 text-amber-100"
      : "border-blue-500/25 bg-blue-500/10 text-blue-100";

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-xs text-slate-200/80">{body}</div>
    </div>
  );
}