"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./auth";

const sql = neon(process.env.DATABASE_URL!);

export interface ResourceRequest {
  resourceId: string;
  quantity: number;
  destination: string;
  priority: "low" | "medium" | "high" | "critical";
  justification: string;
}

export async function requestResourceAllocation(request: ResourceRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check resource availability
    const resource = await sql`
      SELECT * FROM resources WHERE id = ${request.resourceId}
    `;

    if (resource.length === 0) {
      throw new Error("Resource not found");
    }

    if (resource[0].available_quantity < request.quantity) {
      throw new Error("Insufficient resources available");
    }

    // Create allocation request
    const allocation = await sql`
      INSERT INTO resource_allocations 
      (resource_id, quantity, destination, requested_by, priority, status)
      VALUES (${request.resourceId}, ${request.quantity}, ${request.destination}, 
              ${user.id}, ${request.priority}, 'pending')
      RETURNING *
    `;

    // Auto-approve critical requests
    if (request.priority === "critical") {
      await approveResourceAllocation(allocation[0].id, user.id);
    }

    // Log the request
    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${user.id}, 'request_resource', 'resource', ${
      request.resourceId
    }, 
              ${JSON.stringify(request)})
    `;

    revalidatePath("/resources");
    return { success: true, allocation: allocation[0] };
  } catch (error) {
    console.error("Error requesting resource allocation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to request resource",
    };
  }
}

export async function approveResourceAllocation(
  allocationId: string,
  approverId: string
) {
  try {
    // Get allocation details
    const allocation = await sql`
      SELECT ra.*, r.name as resource_name, r.available_quantity
      FROM resource_allocations ra
      JOIN resources r ON ra.resource_id = r.id
      WHERE ra.id = ${allocationId}
    `;

    if (allocation.length === 0) {
      throw new Error("Allocation not found");
    }

    const allocationData = allocation[0];

    // Check availability again
    if (allocationData.available_quantity < allocationData.quantity) {
      throw new Error("Insufficient resources available");
    }

    // Update allocation status
    await sql`
      UPDATE resource_allocations 
      SET status = 'approved', approved_by = ${approverId}
      WHERE id = ${allocationId}
    `;

    // Update resource availability
    await sql`
      UPDATE resources 
      SET available_quantity = available_quantity - ${allocationData.quantity},
          updated_at = NOW()
      WHERE id = ${allocationData.resource_id}
    `;

    // Log the approval
    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${approverId}, 'approve_allocation', 'resource_allocation', ${allocationId}, 
              ${JSON.stringify({ quantity: allocationData.quantity })})
    `;

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Error approving resource allocation:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to approve allocation",
    };
  }
}

export async function updateAllocationStatus(
  allocationId: string,
  status: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const updateData: any = { status };
    if (status === "delivered") {
      updateData.delivered_at = "NOW()";
    }

    await sql`
      UPDATE resource_allocations 
      SET status = ${status},
          delivered_at = ${status === "delivered" ? "NOW()" : null}
      WHERE id = ${allocationId}
    `;

    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${
        user.id
      }, 'update_allocation_status', 'resource_allocation', ${allocationId}, 
              ${JSON.stringify({ status })})
    `;

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Error updating allocation status:", error);
    return { success: false, error: "Failed to update allocation status" };
  }
}

export async function getResourceStatus() {
  try {
    const resources = await sql`
      SELECT 
        id,
        name,
        type,
        total_quantity,
        available_quantity,
        unit,
        location,
        status,
        created_at,
        updated_at
      FROM resources 
      ORDER BY type, name
    `;

    return { success: true, resources };
  } catch (error) {
    console.error("Error fetching resource status:", error);
    return { success: false, error: "Failed to fetch resource status" };
  }
}

export async function getResourceAllocations() {
  try {
    const allocations = await sql`
      SELECT 
        ra.*,
        r.name as resource_name,
        r.unit
      FROM resource_allocations ra
      LEFT JOIN resources r ON ra.resource_id = r.id
      ORDER BY ra.requested_at DESC
      LIMIT 20
    `;

    return { success: true, allocations };
  } catch (error) {
    console.error("Error fetching resource allocations:", error);
    return { success: false, error: "Failed to fetch resource allocations" };
  }
}

export async function updateResourceInventory(
  resourceId: string,
  quantity: number,
  operation: "add" | "set"
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (operation === "add") {
      await sql`
        UPDATE resources 
        SET total_quantity = total_quantity + ${quantity},
            available_quantity = available_quantity + ${quantity},
            updated_at = NOW()
        WHERE id = ${resourceId}
      `;
    } else {
      await sql`
        UPDATE resources 
        SET total_quantity = ${quantity},
            available_quantity = ${quantity},
            updated_at = NOW()
        WHERE id = ${resourceId}
      `;
    }

    await sql`
      INSERT INTO system_logs (user_id, action, resource_type, resource_id, details)
      VALUES (${user.id}, 'update_inventory', 'resource', ${resourceId}, 
              ${JSON.stringify({ quantity, operation })})
    `;

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Error updating resource inventory:", error);
    return { success: false, error: "Failed to update inventory" };
  }
}
