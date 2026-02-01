import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, email, gender, birthDate, referredBy, remark, address } = body

    const db = await getDatabase()

    // Generate client ID
    const memberCount = await db.collection("members").countDocuments()
    const clientId = `MEM${String(memberCount + 1).padStart(6, "0")}`

    const newMember = {
      clientId,
      name: `${firstName} ${lastName}`,
      phone,
      email: email || null,
      gender,
      birthDate: birthDate ? new Date(birthDate) : null,
      status: "Active",
      joiningDate: new Date(),
      address: address || null,
      referredBy: referredBy || null,
      remark: remark || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("members").insertOne(newMember)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error creating member:", error)
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const db = await getDatabase()
    const members = await db.collection("members").find({}).sort({ createdAt: -1 }).limit(50).toArray()

    return NextResponse.json(members)
  } catch (error) {
    console.error("[v0] Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
