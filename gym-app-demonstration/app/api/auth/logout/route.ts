// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\api\auth\logout\route.ts
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}