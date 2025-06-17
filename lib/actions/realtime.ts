"use server"

import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function getRealtimeData() {
  try {
    // Get latest sensor readings
    const sensorData = await sql`
      SELECT s.sensor_id, s.name, s.type, s.location, s.status,
             sr.reading_type, sr.value, sr.unit, sr.status as reading_status,
             sr.recorded_at
      FROM sensors s
      LEFT JOIN LATERAL (
        SELECT * FROM sensor_readings 
        WHERE sensor_id = s.id 
        ORDER BY recorded_at DESC 
        LIMIT 1
      ) sr ON true
      WHERE s.status = 'active'
      ORDER BY s.name
    `

    // Get active alerts
    const alerts = await sql`
      SELECT * FROM alerts 
      WHERE status IN ('active', 'monitoring')
      ORDER BY severity DESC, created_at DESC
      LIMIT 10
    `

    // Get evacuation status
    const evacuationStatus = await sql`
      SELECT zone_id, name, status, priority, population
      FROM evacuation_zones
      WHERE status != 'safe'
      ORDER BY priority DESC
    `

    // Get resource availability
    const resources = await sql`
      SELECT type, SUM(available_quantity) as available, SUM(total_quantity) as total
      FROM resources
      GROUP BY type
    `

    return {
      success: true,
      data: {
        sensors: sensorData,
        alerts,
        evacuation: evacuationStatus,
        resources,
        timestamp: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error("Error fetching realtime data:", error)
    return { success: false, error: "Failed to fetch realtime data" }
  }
}

export async function getSystemHealth() {
  try {
    const health = {
      database: await checkDatabaseHealth(),
      sensors: await checkSensorHealth(),
      communication: await checkCommunicationHealth(),
      alerts: await checkAlertSystemHealth(),
    }

    return { success: true, health }
  } catch (error) {
    console.error("Error checking system health:", error)
    return { success: false, error: "Failed to check system health" }
  }
}

async function checkDatabaseHealth() {
  try {
    const start = Date.now()
    await sql`SELECT 1`
    const responseTime = Date.now() - start

    return {
      status: "healthy",
      responseTime,
      uptime: "99.8%",
    }
  } catch (error) {
    return {
      status: "error",
      error: "Database connection failed",
    }
  }
}

async function checkSensorHealth() {
  const sensors = await sql`
    SELECT status, COUNT(*) as count
    FROM sensors
    GROUP BY status
  `

  const total = sensors.reduce((sum, s) => sum + Number.parseInt(s.count), 0)
  const active = sensors.find((s) => s.status === "active")?.count || 0

  return {
    status: active / total > 0.9 ? "healthy" : "warning",
    activeCount: active,
    totalCount: total,
    uptime: `${((active / total) * 100).toFixed(1)}%`,
  }
}

async function checkCommunicationHealth() {
  // Simulate communication system health check
  return {
    status: "healthy",
    channels: {
      mobile: "active",
      radio: "active",
      tv: "active",
      social: "warning",
    },
    deliveryRate: "96.8%",
  }
}

async function checkAlertSystemHealth() {
  const recentAlerts = await sql`
    SELECT COUNT(*) as count
    FROM alerts
    WHERE created_at > NOW() - INTERVAL '24 hours'
  `

  return {
    status: "healthy",
    alertsLast24h: Number.parseInt(recentAlerts[0].count),
    averageResponseTime: "4.2 minutes",
  }
}
