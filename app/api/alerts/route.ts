import { type NextRequest, NextResponse } from "next/server"
import { getActiveAlerts, createEmergencyAlert } from "@/lib/actions/alerts"

export async function GET() {
  try {
    const result = await getActiveAlerts()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ alerts: result.alerts })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = await createEmergencyAlert(data)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ alert: result.alert })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}
