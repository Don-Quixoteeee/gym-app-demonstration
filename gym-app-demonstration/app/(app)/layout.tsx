import Link from "next/link";
import { BarChart3, Dumbbell, LayoutDashboard, Sparkles } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workout", label: "Workouts", icon: Dumbbell },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/ai", label: "AI Coach", icon: Sparkles },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* background texture */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1000px_600px_at_15%_10%,rgba(59,130,246,.20),transparent_55%),radial-gradient(900px_500px_at_85%_0%,rgba(168,85,247,.16),transparent_55%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px]">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/40 p-5 backdrop-blur-xl lg:block">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-[0_18px_50px_rgba(59,130,246,.25)]" />
            <div>
              <div className="text-sm font-bold tracking-tight text-white">GymTrack</div>
              <div className="text-xs text-slate-400">Admin</div>
            </div>
          </div>

          <div className="mt-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Navigation
          </div>

          <nav className="mt-3 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-slate-200/90 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-slate-300 group-hover:text-white" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white">Tip</div>
            <p className="mt-1 text-xs text-slate-400">
              Add a retention “at-risk” list and outreach actions here.
            </p>
          </div>

          <form className="mt-6" action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Logout
            </button>
          </form>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-white">Dashboard</div>
                <div className="hidden text-xs text-slate-400 md:block">
                  Overview & quick actions
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
                  Export
                </button>
                <button className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(37,99,235,.28)] hover:bg-blue-500">
                  New workout
                </button>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 lg:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}