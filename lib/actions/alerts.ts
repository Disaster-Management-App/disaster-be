"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

const sql = neon(process.env.DATABASE_URL!);

export interface CreateAlertData {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  location: string;
  affectedPopulation?: number;
}

export async function createEmergencyAlert(data: CreateAlertData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Create the alert
    const alert = await sql`
      INSERT INTO alerts (type, severity, title, description, location, affected_population, created_by)
      VALUES (${data.type}, ${data.severity}, ${data.title}, ${
      data.description
    }, ${data.location}, ${data.affectedPopulation || 0}, ${user.id})
      RETURNING *
    `;

    // Log the action
    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${user.id}, 'create_alert', 'alert', ${
      alert[0].id
    }, ${JSON.stringify(data)})
    `;

    // Trigger automatic actions based on severity
    if (data.severity === "critical" || data.severity === "high") {
      await triggerAutomaticResponse(alert[0]);
    }

    revalidatePath("/alerts");
    return { success: true, alert: alert[0] };
  } catch (error) {
    console.error("Error creating alert:", error);
    return { success: false, error: "Failed to create alert" };
  }
}

export async function updateAlertStatus(alertId: string, status: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const updatedAlert = await sql`
      UPDATE alerts 
      SET status = ${status}, 
          updated_at = NOW(),
          resolved_at = ${status === "resolved" ? "NOW()" : null}
      WHERE id = ${alertId}
      RETURNING *
    `;

    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${
        user.id
      }, 'update_alert_status', 'alert', ${alertId}, ${JSON.stringify({
      status,
    })})
    `;

    revalidatePath("/alerts");
    return { success: true, alert: updatedAlert[0] };
  } catch (error) {
    console.error("Error updating alert status:", error);
    return { success: false, error: "Failed to update alert status" };
  }
}

export async function getActiveAlerts() {
  try {
    const alerts = await sql`
      SELECT a.*, u.first_name, u.last_name
      FROM alerts a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.status IN ('active', 'monitoring')
      ORDER BY a.created_at DESC
    `;

    return { success: true, alerts };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return { success: false, error: "Failed to fetch alerts" };
  }
}

// New function to create an alert
export async function createAlert(data: {
  type: string;
  severity: string;
  title: string;
  description: string;
  location: string;
  affected_population: number;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    console.log("Creating alert with data:", data); // Add this for debugging
    console.log("Current user:", user); // Add this for debugging

    // Insert the new alert
    const alert = await sql`
      INSERT INTO alerts (
        type, 
        severity, 
        title, 
        description, 
        location, 
        affected_population, 
        status, 
        created_by
      )
      VALUES (
        ${data.type}, 
        ${data.severity}, 
        ${data.title}, 
        ${data.description}, 
        ${data.location}, 
        ${data.affected_population}, 
        'active',
        ${user.id}
      )
      RETURNING *
    `;

    console.log("Alert created:", alert); // Add this for debugging

    // Log the alert creation action
    await sql`
      INSERT INTO system_logs (
        user_id, 
        action, 
        resource_type, 
        resource_id, 
        details
      )
      VALUES (
        ${user.id}, 
        'create_alert', 
        'alert', 
        ${alert[0].id}, 
        ${JSON.stringify(data)}
      )
    `;

    // Refresh the alerts page data
    revalidatePath("/alerts");
    return { success: true, alert: alert[0] };
  } catch (error) {
    console.error("Server error creating alert:", error); // Enhanced error logging
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create alert",
    };
  }
}

async function triggerAutomaticResponse(alert: any) {
  // Automatic broadcast for critical alerts
  if (alert.severity === "critical") {
    await broadcastEmergencyMessage({
      type: "emergency_alert",
      title: alert.title,
      content: alert.description,
      channels: ["mobile", "radio", "tv"],
      targetAudience: "public",
    });
  }

  // Auto-initiate evacuation for flood alerts
  if (alert.type === "flood" && alert.severity === "critical") {
    await initiateEvacuationProcedures(alert.location);
  }
}

async function broadcastEmergencyMessage(messageData: any) {
  const user = await getCurrentUser();

  await sql`
    INSERT INTO messages (type, title, content, channels, target_audience, sent_by)
    VALUES (${messageData.type}, ${messageData.title}, ${messageData.content}, 
            ${messageData.channels}, ${messageData.targetAudience}, ${user?.id})
  `;
}

async function initiateEvacuationProcedures(location: string) {
  // Find zones in the affected location
  const zones = await sql`
    SELECT * FROM evacuation_zones 
    WHERE location ILIKE ${"%" + location + "%"} AND status = 'safe'
  `;

  // Update zone status to warning
  for (const zone of zones) {
    await sql`
      UPDATE evacuation_zones 
      SET status = 'warning', updated_at = NOW()
      WHERE id = ${zone.id}
    `;
  }
}
