import { NextResponse } from "next/server"
import { getRealtimeData } from "@/lib/actions/realtime"

export async function GET() {
  try {
    const result = await getRealtimeData()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch realtime data" }, { status: 500 })
  }
}
