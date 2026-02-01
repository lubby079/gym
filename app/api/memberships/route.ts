import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      packageName,
      planType,
      activities,
      planTiming,
      description,
      duration,
      durationType,
      sessions,
      rackRate,
      baseRate,
      transferDays,
      upgradeDays,
      freezeFrequency,
      freezeDuration,
    } = body

    const db = await getDatabase()

    const newMembership = {
      packageName,
      type: planType,
      activities,
      planTiming,
      description: description || null,
      duration: Number.parseInt(duration),
      durationType,
      sessions: Number.parseInt(sessions),
      rackRate: Number.parseFloat(rackRate),
      price: Number.parseFloat(baseRate),
      transferDays: transferDays ? Number.parseInt(transferDays) : null,
      upgradeDays: upgradeDays ? Number.parseInt(upgradeDays) : null,
      freezeFrequency: freezeFrequency ? Number.parseInt(freezeFrequency) : null,
      freezeDuration: freezeDuration ? Number.parseInt(freezeDuration) : null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("memberships").insertOne(newMembership)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error creating membership:", error)
    return NextResponse.json({ error: "Failed to create membership" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const db = await getDatabase()
    const memberships = await db.collection("memberships").find({ isActive: true }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(memberships)
  } catch (error) {
    console.error("[v0] Error fetching memberships:", error)
    return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 })
  }
}
