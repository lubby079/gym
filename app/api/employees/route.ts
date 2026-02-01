import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const db = await getDatabase()

    const employeeCount = await db.collection("employees").countDocuments()
    const employeeId = `EMP${String(employeeCount + 1).padStart(4, "0")}`

    const employee = {
      employeeId,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      maritalStatus: data.maritalStatus,
      birthDate: new Date(data.birthDate),
      anniversaryDate: data.anniversaryDate ? new Date(data.anniversaryDate) : null,
      language: data.language,
      role: data.gymRole,
      gymActivities: data.gymActivities,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      employeeType: data.employeeType,
      joiningDate: new Date(),
      status: "Active",
      createdAt: new Date(),
    }

    const result = await db.collection("employees").insertOne(employee)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Error adding employee:", error)
    return NextResponse.json({ error: "Failed to add employee" }, { status: 500 })
  }
}
