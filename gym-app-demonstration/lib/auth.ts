// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\lib\auth.ts
import { cookies } from "next/headers";

export const SESSION_COOKIE = "demo_session";

export async function isAuthed(): Promise<boolean> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value === "1";
}

export async function setSessionCookie() {
  const c = await cookies();
  c.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}