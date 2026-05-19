

import { Suspense } from "react";
import WorkoutClient from "./WorkoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Loading workouts...</div>}>
      <WorkoutClient />
    </Suspense>
  );
}