import { prisma } from "@/lib/db";

export type StatsResponse = {
  now: string;
  kpis: {
    workoutsTotal: number;
    workoutsLast7: number;
    workoutsLast30: number;
    activeMembers: number;
  };
  series: {
    workoutsLast7ByDay: Array<{ date: string; count: number }>;
  };
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function getStats(): Promise<StatsResponse> {
  const now = new Date();
  const startToday = startOfDay(now);

  const last7Start = new Date(startToday);
  last7Start.setDate(last7Start.getDate() - 6);

  const last30Start = new Date(startToday);
  last30Start.setDate(last30Start.getDate() - 29);

  const [workoutsTotal, workoutsLast7, workoutsLast30, activeMembers] =
    await Promise.all([
      prisma.workout.count(),
      prisma.workout.count({ where: { startedAt: { gte: last7Start } } }),
      prisma.workout.count({ where: { startedAt: { gte: last30Start } } }),
      prisma.member.count({ where: { status: "ACTIVE" } }),
    ]);

  // groupBy on DateTime groups by exact timestamps, so we normalize to date here.
  const workoutsInLast7 = await prisma.workout.findMany({
    where: { startedAt: { gte: last7Start } },
    select: { startedAt: true },
  });

  const countsByDay = new Map<string, number>();
  for (const w of workoutsInLast7) {
    const key = startOfDay(w.startedAt).toISOString().slice(0, 10);
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1);
  }

  const workoutsLast7ByDay = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(last7Start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: countsByDay.get(key) ?? 0 };
  });

  return {
    now: now.toISOString(),
    kpis: {
      workoutsTotal,
      workoutsLast7,
      workoutsLast30,
      activeMembers,
    },
    series: {
      workoutsLast7ByDay,
    },
  };
}
