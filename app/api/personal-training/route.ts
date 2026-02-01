import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { memberId, packageName, duration, sessions, price, startDate } = body

    const db = await getDatabase()

    // Calculate end date based on duration (in months)
    const start = new Date(startDate)
    const end = new Date(start)
    end.setMonth(end.getMonth() + Number.parseInt(duration))

    const newPT = {
      memberId: new ObjectId(memberId),
      packageName,
      duration: Number.parseInt(duration),
      sessions: Number.parseInt(sessions),
      price: Number.parseFloat(price),
      startDate: start,
      endDate: end,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("personaltraining").insertOne(newPT)

    // Create payment record for PT
    const member = await db.collection("members").findOne({ _id: new ObjectId(memberId) })
    const invoiceCount = await db.collection("payments").countDocuments()
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(6, "0")}`

    const payment = {
      memberId: new ObjectId(memberId),
      invoiceNumber,
      invoiceDate: new Date(),
      planTotal: Number.parseFloat(price),
      discount: 0,
      total: Number.parseFloat(price),
      paid: 0,
      balance: Number.parseFloat(price),
      paymentMode: "Cash",
      status: "PENDING",
      dueDate: new Date(),
      membershipId: result.insertedId,
      type: "Personal Training",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("payments").insertOne(payment)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error creating personal training:", error)
    return NextResponse.json({ error: "Failed to create personal training" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get("memberId")

    const db = await getDatabase()

    const query = memberId ? { memberId: new ObjectId(memberId) } : {}
    const ptSessions = await db
      .collection("personaltraining")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "member",
          },
        },
        { $unwind: "$member" },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json(ptSessions)
  } catch (error) {
    console.error("[v0] Error fetching personal training:", error)
    return NextResponse.json({ error: "Failed to fetch personal training" }, { status: 500 })
  }
}
