import { Entrance } from "@/components";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="">
      <Suspense fallback={<Entrance />}>
        <div>Loading...</div>
      </Suspense>
    </div>
  );
}
