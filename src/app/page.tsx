import { Entrance, Home as HomeComponent } from "@/components";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Entrance />}>
      <HomeComponent />
    </Suspense>
  );
}
