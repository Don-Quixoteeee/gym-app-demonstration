// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\(app)\analytics\page.tsx
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="title">Analytics</h1>
        <p className="subtitle">Retention & engagement charts placeholder.</p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="card p-5">
          <div className="text-sm font-semibold">Retention trend</div>
          <div className="mt-3 h-64 rounded-2xl bg-white/5 border border-white/10" />
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">Peak usage times</div>
          <div className="mt-3 h-64 rounded-2xl bg-white/5 border border-white/10" />
        </div>
      </div>
    </div>
  );
}