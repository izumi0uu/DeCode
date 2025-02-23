"use server";

import { cache } from "react";
import { fetchNavigation } from "@/lib/mock/api/navigation";
import { mode } from "@/resources/config";

export const getNavigation = cache(async () => {
  return await fetchNavigation({
    withProgress: mode.cascaderMode.withProgress,
    lang: mode.language as "zh" | "en",
  });
});
