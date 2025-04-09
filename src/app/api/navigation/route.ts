import { NextResponse } from "next/server";
import { fetchNavigation } from "@/mock/api/navigation";
import { mode } from "@/resources/config";

export async function GET() {
  try {
    const navigation = await fetchNavigation({
      withProgress: mode.cascaderMode.withProgress,
      lang: mode.language as "zh" | "en",
    });

    return NextResponse.json(navigation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch navigation data" },
      { status: 500 }
    );
  }
}
