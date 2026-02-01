import { getDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, gender, birthDate, address, referredBy, remark, leadType, trialBooked } = body

    const db = await getDatabase()

    // Generate enquiry number
    const enquiryCount = await db.collection("enquiries").countDocuments()
    const enquiryNo = String(enquiryCount + 1).padStart(6, "0")

    const newEnquiry = {
      enquiryNo,
      enquiryDate: new Date(),
      name,
      phone,
      email: email || null,
      gender,
      birthDate: birthDate ? new Date(birthDate) : null,
      address: address || null,
      referredBy: referredBy || null,
      remark: remark || null,
      status: "Open",
      leadType: leadType || null,
      trialBooked: trialBooked || false,
      handleBy: null,
      createdBy: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("enquiries").insertOne(newEnquiry)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error creating enquiry:", error)
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const db = await getDatabase()
    const enquiries = await db.collection("enquiries").find({}).sort({ enquiryDate: -1 }).limit(50).toArray()

    return NextResponse.json(enquiries)
  } catch (error) {
    console.error("[v0] Error fetching enquiries:", error)
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 })
  }
}
