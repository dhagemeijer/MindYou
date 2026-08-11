import { NextResponse } from "next/server";
import { sendPushToAll } from "@/lib/push";

export async function POST() {
  try {
    const result = await sendPushToAll({
      title: "MindYou",
      body: "Testmelding — als je dit ziet, werken pushmeldingen.",
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Onbekende fout" },
      { status: 500 }
    );
  }
}
