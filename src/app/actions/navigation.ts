"use server";

import { fetchNavigation } from "@/lib/mock/api/navigation";
import { mode } from "@/resources/config";

export async function getNavigation() {
  return await fetchNavigation({
    withProgress: mode.cascaderMode.withProgress,
    lang: mode.language as "zh" | "en",
  });
}
