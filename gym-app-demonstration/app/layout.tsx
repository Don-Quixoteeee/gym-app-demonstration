import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "GymTrack",
  description: "Gym member progress & retention (demo)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}