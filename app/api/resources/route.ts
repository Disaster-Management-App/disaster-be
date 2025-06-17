import { NextResponse } from "next/server"
import { getResourceStatus } from "@/lib/actions/resources"

export async function GET() {
  try {
    const result = await getResourceStatus()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      resources: result.resources,
      recentAllocations: result.recentAllocations,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}
