// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\api\auth\logout\route.ts
import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  await clearSessionCookie();
  const url = new URL("/login", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000");
  return NextResponse.redirect(url, { status: 303 });
}