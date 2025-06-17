import { NextResponse } from "next/server"
import { getSensorStatus } from "@/lib/actions/sensors"

export async function GET() {
  try {
    const result = await getSensorStatus()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ sensors: result.sensors })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch sensors" }, { status: 500 })
  }
}
