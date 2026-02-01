import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, createSession, hashPassword } from "@/lib/auth"
import { cookies } from "next/headers"
import type { ObjectId } from "mongodb"

async function ensureAdminExists() {
  const db = await getDatabase()
  const userCount = await db.collection("users").countDocuments()

  if (userCount === 0) {
    console.log("[v0] No users found, creating default admin user...")
    const hashedPassword = await hashPassword("mastergym2024")
    await db.collection("users").insertOne({
      name: "Admin User",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      lastLogin: null,
    })
    console.log("[v0] Default admin user created")
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log("[v0] Login attempt for username:", username)

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const db = await getDatabase()

    await ensureAdminExists()

    const user = await db.collection("users").findOne({ username })
    console.log("[v0] User found:", user ? "yes" : "no")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password)
    console.log("[v0] Password valid:", isValid)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last login
    await db.collection("users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    // Create session
    const token = await createSession((user._id as ObjectId).toString())
    console.log("[v0] Session created")

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
