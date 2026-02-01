import { getDatabase } from "../lib/mongodb"
import type { Member, Membership, Payment, Employee, Enquiry, PersonalTraining } from "../lib/db/schema"

async function seed() {
  try {
    const db = await getDatabase()

    await db.collection("members").deleteMany({})
    await db.collection("memberships").deleteMany({})
    await db.collection("payments").deleteMany({})
    await db.collection("employees").deleteMany({})
    await db.collection("attendance").deleteMany({})
    await db.collection("followups").deleteMany({})
    await db.collection("enquiries").deleteMany({})
    await db.collection("personaltraining").deleteMany({})

    console.log("[v0] Cleared existing data")

    // Insert memberships
    const memberships: Membership[] = [
      {
        packageName: "1 Month",
        duration: 1,
        sessions: 30,
        price: 1500,
        type: "General Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        packageName: "2 Months",
        duration: 2,
        sessions: 60,
        price: 2200,
        type: "General Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        packageName: "6 Months",
        duration: 6,
        sessions: 180,
        price: 5000,
        type: "General Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        packageName: "12 Months",
        duration: 12,
        sessions: 360,
        price: 9000,
        type: "General Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        packageName: "15 Months",
        duration: 15,
        sessions: 450,
        price: 7000,
        type: "General Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        packageName: "PT 3 Months",
        duration: 3,
        sessions: 36,
        price: 8000,
        type: "Personal Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        packageName: "PT 6 Months",
        duration: 6,
        sessions: 72,
        price: 15000,
        type: "Personal Training",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const insertedMemberships = await db.collection("memberships").insertMany(memberships)
    console.log("[v0] Inserted memberships:", insertedMemberships.insertedCount)

    // Insert members
    const members: Member[] = [
      {
        clientId: "MEM000001",
        name: "Uvesh Shaikh",
        phone: "7600744846",
        email: "uvesh@example.com",
        gender: "Male",
        status: "Active",
        joiningDate: new Date("2025-12-29"),
        expiryDate: new Date("2026-02-28"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        clientId: "MEM000002",
        name: "Mo Sameer Sharif Raheem",
        phone: "9054903506",
        email: "sameer@example.com",
        gender: "Male",
        status: "Active",
        joiningDate: new Date("2026-01-02"),
        expiryDate: new Date("2026-02-02"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        clientId: "MEM000003",
        name: "Shaikh Mo Zaki Mo Shafi",
        phone: "9558966358",
        gender: "Male",
        status: "Active",
        joiningDate: new Date("2025-12-15"),
        expiryDate: new Date("2026-01-15"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const insertedMembers = await db.collection("members").insertMany(members)
    console.log("[v0] Inserted members:", insertedMembers.insertedCount)

    // Insert payments
    const memberIds = Object.values(insertedMembers.insertedIds)
    const membershipIds = Object.values(insertedMemberships.insertedIds)

    const payments: Payment[] = [
      {
        memberId: memberIds[0],
        invoiceNumber: "TMG/2025-26/617",
        invoiceDate: new Date("2026-01-02"),
        planTotal: 9999,
        discount: 4999,
        total: 5000,
        paid: 5000,
        balance: 0,
        paymentMode: "Cash",
        status: "PAID",
        membershipId: membershipIds[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        memberId: memberIds[1],
        invoiceNumber: "TMG/2025-26/618",
        invoiceDate: new Date("2026-01-02"),
        planTotal: 1500,
        discount: 0,
        total: 1500,
        paid: 1500,
        balance: 0,
        paymentMode: "Cash",
        status: "PAID",
        membershipId: membershipIds[0],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        memberId: memberIds[2],
        invoiceNumber: "TMG/2025-26/619",
        invoiceDate: new Date("2026-01-02"),
        planTotal: 9999,
        discount: 5499,
        total: 4500,
        paid: 4500,
        balance: 0,
        paymentMode: "Cash",
        status: "PAID",
        membershipId: membershipIds[2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const insertedPayments = await db.collection("payments").insertMany(payments)
    console.log("[v0] Inserted payments:", insertedPayments.insertedCount)

    // Insert employees
    const employees: Employee[] = [
      {
        employeeId: "EMP001",
        name: "Raashid Shaikh",
        phone: "9876543210",
        email: "raashid@mastergym.com",
        role: "Trainer",
        joiningDate: new Date("2025-01-01"),
        salary: 25000,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        employeeId: "EMP002",
        name: "John Doe",
        phone: "9876543211",
        email: "john@mastergym.com",
        role: "Manager",
        joiningDate: new Date("2025-01-15"),
        salary: 30000,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        employeeId: "EMP003",
        name: "Sarah Williams",
        phone: "9876543212",
        email: "sarah@mastergym.com",
        role: "Receptionist",
        joiningDate: new Date("2025-02-01"),
        salary: 18000,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const insertedEmployees = await db.collection("employees").insertMany(employees)
    console.log("[v0] Inserted employees:", insertedEmployees.insertedCount)

    // Insert follow-ups
    const followups = [
      {
        memberId: memberIds[0],
        type: "Membership Renewal",
        dueDate: new Date("2026-02-28"),
        status: "Hot",
        comment: "Gym Workout, 2 months, renewal due on 28-02-2026.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        memberId: memberIds[1],
        type: "Balance Due",
        dueDate: new Date("2026-01-05"),
        status: "Hot",
        comment: "Follow up for balance payment of Rs. 3000 due on 05-01-2026",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        memberId: memberIds[2],
        type: "Membership Renewal",
        dueDate: new Date("2026-01-15"),
        status: "Warm",
        comment: "15 month package, 15 months, renewal due on 15-01-2026.",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("followups").insertMany(followups)
    console.log("[v0] Inserted follow-ups")

    const enquiries: Enquiry[] = [
      {
        enquiryNo: "766551",
        enquiryDate: new Date("2025-11-07"),
        name: "Rudra Rana",
        phone: "+917068213997",
        gender: "Female",
        status: "Open",
        leadType: "Hot",
        trialBooked: false,
        handleBy: "Raashid shaikh",
        createdBy: "Raashid shaikh",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        enquiryNo: "766552",
        enquiryDate: new Date("2025-11-08"),
        name: "Priya Sharma",
        phone: "+919876543210",
        email: "priya@example.com",
        gender: "Female",
        status: "Open",
        leadType: "Warm",
        trialBooked: true,
        handleBy: "John Doe",
        createdBy: "Raashid shaikh",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        enquiryNo: "766553",
        enquiryDate: new Date("2025-11-09"),
        name: "Amit Kumar",
        phone: "+919876543211",
        gender: "Male",
        status: "Close",
        leadType: "Hot",
        trialBooked: true,
        handleBy: "Raashid shaikh",
        createdBy: "Raashid shaikh",
        remark: "Converted to member",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("enquiries").insertMany(enquiries)
    console.log("[v0] Inserted enquiries")

    const personalTraining: PersonalTraining[] = [
      {
        memberId: memberIds[0],
        packageName: "PT 3 Months",
        duration: 3,
        sessions: 36,
        price: 8000,
        startDate: new Date("2026-01-02"),
        endDate: new Date("2026-04-02"),
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("personaltraining").insertMany(personalTraining)
    console.log("[v0] Inserted personal training sessions")

    console.log("[v0] ✅ Database seeded successfully!")
    console.log("[v0] Total collections created: 8")
    console.log("[v0] - Members: 3")
    console.log("[v0] - Memberships: 7")
    console.log("[v0] - Payments: 3")
    console.log("[v0] - Employees: 3")
    console.log("[v0] - Follow-ups: 3")
    console.log("[v0] - Enquiries: 3")
    console.log("[v0] - Personal Training: 1")
  } catch (error) {
    console.error("[v0] Error seeding database:", error)
    throw error
  }
}

seed()
