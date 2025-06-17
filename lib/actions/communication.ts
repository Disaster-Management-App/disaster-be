import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getCommunicationLogs() {
  try {
    // Using * to select all columns to avoid errors with specific column names
    const logs = await sql`
      SELECT * 
      FROM messages 
      ORDER BY sent_at DESC 
      LIMIT 50
    `;

    return { success: true, logs };
  } catch (error) {
    console.error("Error fetching communication logs:", error);
    return { success: false, error: "Failed to fetch communication logs" };
  }
}

export async function getBroadcastChannels() {
  try {
    // Since we don't have a channels table, we'll return some default channels
    const channels = [
      {
        id: "1",
        name: "Emergency Radio Network",
        type: "radio",
        status: "active",
        coverage: "95%",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Mobile Alert System",
        type: "mobile",
        status: "active",
        coverage: "98%",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Television Emergency Broadcast",
        type: "tv",
        status: "active",
        coverage: "92%",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return { success: true, channels };
  } catch (error) {
    console.error("Error fetching broadcast channels:", error);
    return { success: false, error: "Failed to fetch broadcast channels" };
  }
}
