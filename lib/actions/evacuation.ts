"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

const sql = neon(process.env.DATABASE_URL!);

export interface EvacuationOrder {
  zoneId: string;
  priority: "low" | "medium" | "high" | "critical";
  reason: string;
  estimatedDuration: string;
}

export async function initiateEvacuation(order: EvacuationOrder) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Update zone status
    const zone = await sql`
      UPDATE evacuation_zones 
      SET status = 'evacuating', priority = ${order.priority}, updated_at = NOW()
      WHERE zone_id = ${order.zoneId}
      RETURNING *
    `;

    if (zone.length === 0) {
      throw new Error("Zone not found");
    }

    // Log the evacuation order
    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${user.id}, 'initiate_evacuation', 'evacuation_zone', ${
      zone[0].id
    }, 
              ${JSON.stringify(order)})
    `;

    // Send evacuation notice
    await sendEvacuationNotice(zone[0], order);

    // Allocate emergency resources
    await allocateEvacuationResources(zone[0]);

    revalidatePath("/evacuation");
    return { success: true, zone: zone[0] };
  } catch (error) {
    console.error("Error initiating evacuation:", error);
    return { success: false, error: "Failed to initiate evacuation" };
  }
}

export async function updateEvacuationProgress(
  zoneId: string,
  evacuatedCount: number
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const zone = await sql`
      SELECT * FROM evacuation_zones WHERE zone_id = ${zoneId}
    `;

    if (zone.length === 0) {
      throw new Error("Zone not found");
    }

    const evacuationPercentage = (evacuatedCount / zone[0].population) * 100;

    // Update status based on progress
    let newStatus = "evacuating";
    if (evacuationPercentage >= 95) {
      newStatus = "evacuated";
    }

    await sql`
      UPDATE evacuation_zones 
      SET status = ${newStatus}, updated_at = NOW()
      WHERE zone_id = ${zoneId}
    `;

    // Log progress update
    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${user.id}, 'update_evacuation_progress', 'evacuation_zone', ${
      zone[0].id
    }, 
              ${JSON.stringify({
                evacuatedCount,
                percentage: evacuationPercentage,
              })})
    `;

    revalidatePath("/evacuation");
    return { success: true, evacuatedCount, percentage: evacuationPercentage };
  } catch (error) {
    console.error("Error updating evacuation progress:", error);
    return { success: false, error: "Failed to update evacuation progress" };
  }
}

export async function getEvacuationStatus() {
  try {
    const zones = await sql`
      SELECT 
        id,
        zone_id,
        name,
        population,
        status,
        priority,
        evacuated,
        created_at,
        updated_at
      FROM evacuation_zones 
      ORDER BY priority DESC, created_at DESC
    `;

    return { success: true, zones };
  } catch (error) {
    console.error("Error fetching evacuation status:", error);
    return { success: false, error: "Failed to fetch evacuation status" };
  }
}

export async function getEvacuationRoutes() {
  try {
    // Use SELECT * to get all available columns instead of specifying each one
    const routes = await sql`
      SELECT *
      FROM evacuation_routes 
      ORDER BY created_at DESC
    `;

    return { success: true, routes };
  } catch (error) {
    console.error("Error fetching evacuation routes:", error);
    return { success: false, error: "Failed to fetch evacuation routes" };
  }
}

export async function updateRouteStatus(
  routeId: string,
  status: string,
  usage?: number
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const updateData: any = { status, updated_at: "NOW()" };
    if (usage !== undefined) {
      updateData.current_usage = usage;
    }

    await sql`
      UPDATE evacuation_routes 
      SET status = ${status}, 
          current_usage = ${usage || 0}
      WHERE route_id = ${routeId}
    `;

    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${
        user.id
      }, 'update_route_status', 'evacuation_route', ${routeId}, 
              ${JSON.stringify({ status, usage })})
    `;

    revalidatePath("/evacuation");
    return { success: true };
  } catch (error) {
    console.error("Error updating route status:", error);
    return { success: false, error: "Failed to update route status" };
  }
}

async function sendEvacuationNotice(zone: any, order: EvacuationOrder) {
  const messageContent = `
    EVACUATION ORDER - ${zone.name}
    
    Priority: ${order.priority.toUpperCase()}
    Reason: ${order.reason}
    Estimated Duration: ${order.estimatedDuration}
    
    Please evacuate immediately using designated routes.
    Proceed to nearest emergency shelter.
  `;

  await sql`
    INSERT INTO messages (type, title, content, channels, target_audience)
    VALUES ('evacuation_order', 
            'EVACUATION ORDER - ${zone.name}',
            ${messageContent},
            ARRAY['mobile', 'radio', 'tv'],
            'zone_${zone.zone_id}')
  `;
}

async function allocateEvacuationResources(zone: any) {
  // Allocate emergency vehicles
  const vehicles = await sql`
    SELECT * FROM resources 
    WHERE type = 'vehicles' AND available_quantity > 0
    ORDER BY available_quantity DESC
    LIMIT 3
  `;

  for (const vehicle of vehicles) {
    const allocateQuantity = Math.min(vehicle.available_quantity, 2);

    await sql`
      INSERT INTO resource_allocations (resource_id, quantity, destination, status, priority)
      VALUES (${vehicle.id}, ${allocateQuantity}, ${zone.name}, 'approved', 'high')
    `;

    await sql`
      UPDATE resources 
      SET available_quantity = available_quantity - ${allocateQuantity}
      WHERE id = ${vehicle.id}
    `;
  }
}
