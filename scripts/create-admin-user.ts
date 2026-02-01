import { MongoClient } from "mongodb"

const MONGODB_URI =
  "mongodb+srv://mastergym:mastergym@cluster0.9z9hu.mongodb.net/master_gym?retryWrites=true&w=majority"

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "master_gym_salt_2024")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("master_gym")

    // Check if admin already exists
    const existingAdmin = await db.collection("users").findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Admin user already exists. Updating password...")
      const hashedPassword = await hashPassword("mastergym2024")
      await db.collection("users").updateOne(
        { username: "admin" },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
        },
      )
      console.log("Admin password updated successfully!")
    } else {
      // Create admin user
      const hashedPassword = await hashPassword("mastergym2024")

      await db.collection("users").insertOne({
        username: "admin",
        password: hashedPassword,
        name: "Admin User",
        email: "admin@mastergym.com",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log("Admin user created successfully!")
    }

    // Create index for sessions
    await db.collection("sessions").createIndex({ token: 1 }, { unique: true })
    await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    console.log("Session indexes created successfully!")
    console.log("\nLogin credentials:")
    console.log("Username: admin")
    console.log("Password: mastergym2024")
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
  }
}

createAdminUser()
