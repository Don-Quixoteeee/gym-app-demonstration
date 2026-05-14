import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request, { params }: { params: any }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      exercises: { orderBy: { sortOrder: "asc" }, include: { sets: { orderBy: { setNumber: "asc" } } } },
    },
  });
  if (!workout) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ workout });
}

export async function PUT(req: Request, { params }: { params: any }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  let body: any = null;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body?.title === "string" ? body.title.trim() : undefined;
  const exercises = Array.isArray(body?.exercises) ? body.exercises.filter((x: any) => typeof x === "string") : undefined;

  try {
    // Update the workout title and replace exercises simply for the demo.
    const updated = await prisma.$transaction(async (tx) => {
      if (title !== undefined) {
        await tx.workout.update({ where: { id }, data: { title } });
      }

      if (exercises !== undefined) {
        // Delete existing exercises and recreate to keep it simple for demo.
        await tx.exercise.deleteMany({ where: { workoutId: id } });
        for (let i = 0; i < exercises.length; i++) {
          await tx.exercise.create({ data: { workoutId: id, name: exercises[i].trim(), sortOrder: i } });
        }
      }

      const workout = await tx.workout.findUnique({
        where: { id },
        include: { exercises: { orderBy: { sortOrder: "asc" }, include: { sets: { orderBy: { setNumber: "asc" } } } } },
      });
      return workout;
    });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ workout: updated });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  try {
  await prisma.workout.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    // Surface the underlying error message to aid debugging (safe for dev).
    const msg = e?.message || String(e);
    // Log on the server console as well
    console.error("DELETE /api/workouts/[id] error:", msg);
    // Prisma throws a P2025 (or message mentioning 'No record was found') when the
    // requested record doesn't exist. Return 404 in that case so clients can
    // treat delete as idempotent.
    if (e?.code === "P2025" || /No record was found/i.test(msg)) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
