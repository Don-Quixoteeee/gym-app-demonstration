// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\api\auth\login\route.ts
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body ?? {};

  const allowedEmail = process.env.DEMO_LOGIN_EMAIL;
  const allowedPassword = process.env.DEMO_LOGIN_PASSWORD;

  if (!allowedEmail || !allowedPassword) {
    return NextResponse.json(
      { ok: false, error: "Missing DEMO_LOGIN_EMAIL/DEMO_LOGIN_PASSWORD in .env.local" },
      { status: 500 }
    );
  }

  if (email === allowedEmail && password === allowedPassword) {
    await setSessionCookie();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
}