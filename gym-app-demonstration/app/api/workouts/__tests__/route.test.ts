import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => {
  return {
    prisma: {
      workout: {
        findMany: vi.fn(async () => []),
        create: vi.fn(async () => ({
          id: "w1",
          title: "Workout — 1/1/2026",
          startedAt: new Date().toISOString(),
          exercises: [],
        })),
      },
    },
  };
});

describe("/api/workouts", () => {
  it("GET returns workouts array", async () => {
    const { GET } = await import("../route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ workouts: [] });
  });

  it("POST creates a workout", async () => {
    const { POST } = await import("../route");
    const res = await POST();
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.workout.id).toBe("w1");
  });
});
