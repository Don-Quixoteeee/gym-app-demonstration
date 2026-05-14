"use client";

import Link from "next/link";

export default function TopbarActions() {
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
        Export
      </button>

      {/* Navigate to a dedicated page for creating a new workout */}
      <Link
        href="/workout/new"
        className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500"
      >
        New workout
      </Link>
    </div>
  );
}
 
