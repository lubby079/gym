import { cookies } from "next/headers"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface SerializedUser {
  id: string
  name: string
  username: string
  role: string
}

// Simple hash function for passwords (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "master_gym_salt_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password)
  return hash === hashedPassword
}

// Session token generation
export function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function getCurrentUser(): Promise<SerializedUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return null
    }

    const db = await getDatabase()
    const session = await db.collection("sessions").findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    })

    if (!session) {
      return null
    }

    let userId: ObjectId
    try {
      userId = new ObjectId(session.userId)
    } catch {
      return null
    }

    const user = await db.collection("users").findOne({
      _id: userId,
    })

    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      role: user.role,
    }
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}

// Create session for user
export async function createSession(userId: string): Promise<string> {
  const db = await getDatabase()
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await db.collection("sessions").insertOne({
    userId: userId,
    token,
    expiresAt,
    createdAt: new Date(),
  })

  return token
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  const db = await getDatabase()
  await db.collection("sessions").deleteOne({ token })
}
