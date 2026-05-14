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

export async function POST(req: Request) {
	// Accept a JSON body: { title: string, exercises?: string[] }
	let body: any = null;
	try {
		body = await req.json();
	} catch (e) {
		// no body — we'll fall back to a demo workout.
	}

	const now = new Date();

	const titleFromBody = body?.title;
	const exercisesFromBody: string[] | undefined = Array.isArray(body?.exercises)
		? body.exercises.filter((x: any) => typeof x === "string" && x.trim().length > 0)
		: undefined;

	// validate
	if (titleFromBody && typeof titleFromBody !== "string") {
		return NextResponse.json({ error: "Invalid title" }, { status: 400 });
	}

	// Temporary: workouts require a Member (schema has required memberId).
	const demoMember = await prisma.member.upsert({
		where: { email: "demo.member@gym.local" },
		create: { email: "demo.member@gym.local", fullName: "Demo Member" },
		update: { fullName: "Demo Member" },
	});

	// If we received a valid body with a title, create using provided data; otherwise
	// fall back to the original demo create behavior.
	if (titleFromBody && titleFromBody.trim().length > 0) {
		const workout = await prisma.workout.create({
			data: {
				memberId: demoMember.id,
				title: titleFromBody.trim(),
				startedAt: now,
				exercises: {
					create: (exercisesFromBody && exercisesFromBody.length > 0)
						? exercisesFromBody.map((name, i) => ({ name: name.trim(), sortOrder: i }))
						: { name: "Exercise 1", sortOrder: 0 },
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

	// Fallback: create a quick demo workout when no/invalid body provided.
	const title = `Workout — ${now.toLocaleDateString("en-US")}`;
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
