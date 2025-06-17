"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const sql = neon(process.env.DATABASE_URL!);

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key"
);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  phone?: string;
}

export async function login(credentials: LoginCredentials) {
  try {
    // Find user by email
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${credentials.email} AND is_active = true
    `;

    if (users.length === 0) {
      return { success: false, error: "Invalid credentials" };
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password_hash
    );
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" };
    }

    // Create JWT token using jose
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // Log login
    await sql`
      INSERT INTO system_logs (user_id, action, details)
      VALUES (${user.id}, 'login', ${JSON.stringify({ timestamp: new Date() })})
    `;

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

export async function register(data: RegisterData) {
  try {
    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${data.email}
    `;

    if (existingUsers.length > 0) {
      return { success: false, error: "User already exists" };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 12);

    // Create user
    const newUser = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, role, department, phone)
      VALUES (${data.email}, ${passwordHash}, ${data.firstName}, ${data.lastName}, 
              ${data.role}, ${data.department}, ${data.phone})
      RETURNING id, email, first_name, last_name, role, department
    `;

    return { success: true, user: newUser[0] };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "Logout failed" };
  }
}

export async function getCurrentUser() {
  try {
    // For development purposes, always return the admin user
    // IMPORTANT: REMOVE THIS BEFORE PRODUCTION!

    // First, try to get user from token (normal flow)
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        const users = await sql`
          SELECT id, email, first_name, last_name, role, department, phone
          FROM users 
          WHERE id = ${payload.userId as string} AND is_active = true
        `;

        if (users.length > 0) {
          return users[0];
        }
      } catch (tokenError) {
        console.log("Token validation failed, using fallback admin");
      }
    }

    // If token is invalid or missing, get the admin user as fallback
    const adminUsers = await sql`
      SELECT id, email, first_name as firstName, last_name as lastName, role, department, phone
      FROM users 
      WHERE role = 'admin' AND is_active = true
      LIMIT 1
    `;

    if (adminUsers.length > 0) {
      return adminUsers[0];
    }

    // Final fallback
    return {
      id: "00000000-0000-0000-0000-000000000000",
      email: "admin@disaster.gov",
      first_name: "Developer",
      last_name: "Admin",
      role: "admin",
      department: "Development",
    };
  } catch (error) {
    console.error("Get current user error:", error);

    // Even if there's an error, return a fake admin user
    return {
      id: "00000000-0000-0000-0000-000000000000",
      email: "admin@disaster.gov",
      first_name: "Developer",
      last_name: "Admin",
      role: "admin",
      department: "Development",
    };
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<RegisterData>
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.id !== userId && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    const updateFields: any = {};
    if (updates.firstName) updateFields.first_name = updates.firstName;
    if (updates.lastName) updateFields.last_name = updates.lastName;
    if (updates.department) updateFields.department = updates.department;
    if (updates.phone) updateFields.phone = updates.phone;
    if (updates.password) {
      updateFields.password_hash = await bcrypt.hash(updates.password, 12);
    }

    updateFields.updated_at = new Date().toISOString();

    // Build update query manually to avoid SQL injection
    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const values = [userId, ...Object.values(updateFields)];

    await sql`
      UPDATE users 
      SET ${sql.unsafe(setClause)}
      WHERE id = $1
    `.apply(null, values);

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}
