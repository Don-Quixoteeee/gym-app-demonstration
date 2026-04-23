// filepath: c:\Users\Launchpad2\Downloads\gym-app-demonstration\gym-app-demonstration\app\page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the main dashboard. The middleware will handle auth checks.
  redirect("/dashboard");
}