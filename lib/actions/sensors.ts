import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getSensorStatus() {
  try {
    // Use SELECT * to avoid errors with non-existent columns
    const sensors = await sql`
      SELECT * 
      FROM sensors 
      ORDER BY name
    `;

    // If your page component expects certain fields, map them here
    const formattedSensors = sensors.map((sensor) => ({
      ...sensor,
      battery_level: sensor.battery_level || 0,
      status: sensor.status || "unknown",
    }));

    return { success: true, sensors: formattedSensors };
  } catch (error) {
    console.error("Error fetching sensor status:", error);
    return {
      success: false,
      error: "Failed to fetch sensor status",
      sensors: [],
    };
  }
}

export async function getSensorReadings() {
  try {
    // Use sr.* to get all fields from sensor_readings
    const readings = await sql`
      SELECT 
        sr.*,
        s.name as sensor_name
      FROM sensor_readings sr
      LEFT JOIN sensors s ON sr.sensor_id = s.id
      WHERE sr.recorded_at > NOW() - INTERVAL '24 hours'
      ORDER BY sr.recorded_at DESC
      LIMIT 100
    `;

    return { success: true, readings };
  } catch (error) {
    console.error("Error fetching sensor readings:", error);
    return {
      success: false,
      error: "Failed to fetch sensor readings",
      readings: [],
    };
  }
}
