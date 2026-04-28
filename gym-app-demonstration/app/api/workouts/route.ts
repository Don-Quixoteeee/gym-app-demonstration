import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
	const workouts = await prisma.workout.findMany({
		take: 50,
		orderBy: { startedAt: "desc" },
		include: {
			exercises: {
				orderBy: { sortOrder: "asc" },
				include: { sets: { orderBy: { setNumber: "asc" } } },
			},
		},
	});

	return NextResponse.json({ workouts });
}

export async function POST() {
	const now = new Date();
	const title = `Workout — ${now.toLocaleDateString("en-US")}`;

	// Temporary: workouts require a Member (schema has required memberId).
	// Until we build a full “create workout” form with member selection, connect to a
	// stable demo member so creation succeeds and workouts persist.
	const demoMember = await prisma.member.upsert({
		where: { email: "demo.member@gym.local" },
		create: { email: "demo.member@gym.local", fullName: "Demo Member" },
		update: { fullName: "Demo Member" },
	});

	const workout = await prisma.workout.create({
		data: {
			memberId: demoMember.id,
			title,
			startedAt: now,
			exercises: {
				create: [
					{
						name: "Exercise 1",
						sortOrder: 0,
					},
				],
			},
		},
		include: {
			exercises: {
				orderBy: { sortOrder: "asc" },
				include: { sets: { orderBy: { setNumber: "asc" } } },
			},
		},
	});

	return NextResponse.json({ workout }, { status: 201 });
}
