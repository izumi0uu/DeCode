import React, { Suspense } from "react";
import { AnimateLessonsBoxes as LessonsBoxesContent } from "./lessons-boxes";
import { LessonsBoxesSkeleton } from "../skeletons/lesson-boxes-skeleton";

export const AnimateLessonsBoxes = () => {
  return (
    <Suspense fallback={<LessonsBoxesSkeleton />}>
      <LessonsBoxesContent />
    </Suspense>
  );
};
