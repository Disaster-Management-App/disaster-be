// test-connection.js
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.log("❌ DATABASE_URL not found in environment variables");
      console.log("Current working directory:", process.cwd());
      console.log("Looking for .env.local file...");
      return;
    }

    console.log("✅ DATABASE_URL found");
    console.log(
      "Connection string starts with:",
      process.env.DATABASE_URL.substring(0, 20) + "..."
    );

    const sql = neon(process.env.DATABASE_URL);

    // Simple test query
    const result =
      await sql`SELECT NOW() as current_time, version() as postgres_version`;

    console.log("✅ Connection successful!");
    console.log("📅 Current time:", result[0].current_time);
    console.log("🐘 PostgreSQL version:", result[0].postgres_version);

    // Test if we can create a simple table
    await sql`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO connection_test (message) 
      VALUES ('Connection test successful!')
    `;

    const testData = await sql`SELECT * FROM connection_test LIMIT 1`;
    console.log("📝 Test data:", testData[0]);

    // Clean up
    await sql`DROP TABLE connection_test`;

    console.log("🎉 Your database is ready for the full setup!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting tips:");
    console.log("1. Check your DATABASE_URL in .env.local");
    console.log("2. Make sure your Neon project is active");
    console.log("3. Verify the connection string is complete");
  }
}

testConnection();
