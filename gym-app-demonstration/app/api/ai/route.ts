import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function createWorkoutSummary(workouts: Array<{
  title?: string | null;
  startedAt: Date;
  exercises: Array<{ name: string }>;
  notes?: string | null;
}>) {
  if (workouts.length === 0) {
    return 'No recent workouts are available in the database.';
  }

  return workouts
    .map((workout, index) => {
      const exerciseNames = workout.exercises.map((exercise) => exercise.name).join(', ') || 'No exercises recorded';
      return `Workout ${index + 1}: ${workout.title ?? 'Untitled workout'} on ${formatDate(workout.startedAt)} with ${workout.exercises.length} exercise(s) (${exerciseNames}). Notes: ${workout.notes ?? 'None.'}`;
    })
    .join(' \n');
}

async function buildDatabaseContext() {
  const now = new Date();
  const last30 = new Date(now);
  last30.setDate(last30.getDate() - 30);

  const [totalWorkouts, workoutsLast7, workoutsLast30, activeMembers, recentWorkouts] =
    await Promise.all([
      prisma.workout.count(),
      prisma.workout.count({ where: { startedAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } }),
      prisma.workout.count({ where: { startedAt: { gte: last30 } } }),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.workout.findMany({
        where: { startedAt: { gte: last30 } },
        include: { exercises: { select: { name: true } } },
        orderBy: { startedAt: 'desc' },
        take: 5,
      }),
    ]);

  const workoutSummary = createWorkoutSummary(recentWorkouts);

  return `Database context:
- Active members: ${activeMembers}
- Total workouts: ${totalWorkouts}
- Workouts in last 7 days: ${workoutsLast7}
- Workouts in last 30 days: ${workoutsLast30}
- Most recent workouts (last 30 days):\n${workoutSummary}

Use this data to ground your recommendations and avoid hallucinating metrics or workout history that is not present in the database.`;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const databaseContext = await buildDatabaseContext();

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        instructions:
          'You are a professional fitness coach. Provide helpful, evidence-based advice about workout routines, exercise form, nutrition, and fitness goals. Keep your responses concise, actionable, and tailored to the user data from the gym app database.',
        input: [
          {
            role: 'developer',
            content: databaseContext,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_output_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.json().catch(() => null);
      console.error('OpenAI Responses API error:', errorBody);
      return NextResponse.json(
        {
          error:
            errorBody?.error?.message ||
            'Failed to get response from AI',
          details: errorBody,
        },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    const aiMessage =
      data.output_text ||
      ((data.output ?? []) as any[])
        .flatMap((item: any) => item?.content ?? [])
        .filter((part: any) => part?.type === 'output_text')
        .map((part: any) => part.text)
        .join(' ') ||
      '';

    return NextResponse.json({ response: aiMessage });
  } catch (error) {
    console.error('Error in AI coach route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
