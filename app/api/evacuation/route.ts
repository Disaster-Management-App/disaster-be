import { NextResponse } from "next/server"
import { getEvacuationStatus } from "@/lib/actions/evacuation"

export async function GET() {
  try {
    const result = await getEvacuationStatus()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      zones: result.zones,
      routes: result.routes,
      shelters: result.shelters,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch evacuation data" }, { status: 500 })
  }
}
