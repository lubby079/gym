import { getDatabase } from "@/lib/mongodb"

function serializeDoc(doc: any): any {
  if (!doc) return null
  const serialized = JSON.parse(JSON.stringify(doc))
  // Convert _id to string if it exists
  if (serialized._id) {
    serialized._id = serialized._id.toString ? serialized._id.toString() : String(serialized._id)
  }
  return serialized
}

function serializeDocs(docs: any[]): any[] {
  return docs.map(serializeDoc)
}

export async function getDashboardStats() {
  const db = await getDatabase()

  const totalMembers = await db.collection("members").countDocuments()
  const activeMembers = await db.collection("members").countDocuments({ status: "Active" })
  const upcomingRenewals = await db.collection("members").countDocuments({
    expiryDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  })

  const totalSalesResult = await db
    .collection("payments")
    .aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()

  const freshSalesResult = await db
    .collection("payments")
    .aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()

  const balancePayments = await db
    .collection("payments")
    .aggregate([
      {
        $group: {
          _id: null,
          paid: { $sum: "$paid" },
          due: { $sum: "$balance" },
        },
      },
    ])
    .toArray()

  const followUpsCount = await db.collection("followups").countDocuments({ status: { $ne: "Done" } })

  return {
    members: {
      total: totalMembers,
      active: activeMembers,
      upcomingRenewals,
    },
    sales: {
      total: {
        amount: totalSalesResult[0]?.totalAmount || 0,
        count: totalSalesResult[0]?.count || 0,
      },
      fresh: {
        amount: freshSalesResult[0]?.totalAmount || 0,
        count: freshSalesResult[0]?.count || 0,
      },
    },
    balance: {
      paid: balancePayments[0]?.paid || 0,
      due: balancePayments[0]?.due || 0,
    },
    followUps: followUpsCount,
  }
}

export async function getRecentFollowUps() {
  const db = await getDatabase()

  const followUps = await db
    .collection("followups")
    .aggregate([
      {
        $match: { status: { $ne: "Done" } },
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: "$member",
      },
      {
        $sort: { dueDate: 1 },
      },
      {
        $limit: 5,
      },
    ])
    .toArray()

  return serializeDocs(followUps)
}

export async function getMembers(filter: { status?: string; search?: string } = {}) {
  const db = await getDatabase()

  const query: any = {}
  if (filter.status && filter.status !== "All") {
    query.status = filter.status
  }
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { phone: { $regex: filter.search, $options: "i" } },
      { clientId: { $regex: filter.search, $options: "i" } },
    ]
  }

  const members = await db.collection("members").find(query).sort({ createdAt: -1 }).toArray()

  return serializeDocs(members)
}

export async function getMemberships() {
  const db = await getDatabase()

  const memberships = await db.collection("memberships").find({ isActive: true }).sort({ duration: 1 }).toArray()

  const membershipsWithCounts = await Promise.all(
    memberships.map(async (membership) => {
      const count = await db.collection("members").countDocuments({
        membershipId: membership._id,
        status: "Active",
      })
      return { ...membership, memberCount: count }
    }),
  )

  return serializeDocs(membershipsWithCounts)
}

export async function getPayments(
  filter: { status?: string; search?: string; dueDate?: string; invoiceDate?: string } = {},
) {
  const db = await getDatabase()

  const query: any = {}
  if (filter.status && filter.status !== "All" && filter.status !== "all") {
    query.status = filter.status
  }

  const now = new Date()
  if (filter.dueDate && filter.dueDate !== "all") {
    if (filter.dueDate === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      query.dueDate = { $gte: startOfDay, $lt: endOfDay }
    } else if (filter.dueDate === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      query.dueDate = { $gte: weekAgo }
    } else if (filter.dueDate === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      query.dueDate = { $gte: monthAgo }
    }
  }

  if (filter.invoiceDate && filter.invoiceDate !== "all") {
    if (filter.invoiceDate === "today") {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      query.invoiceDate = { $gte: startOfDay, $lt: endOfDay }
    } else if (filter.invoiceDate === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      query.invoiceDate = { $gte: weekAgo }
    }
  }

  const payments = await db
    .collection("payments")
    .aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: { path: "$member", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "membership",
        },
      },
      {
        $unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { invoiceDate: -1 },
      },
    ])
    .toArray()

  let filteredPayments = payments
  if (filter.search) {
    const searchLower = filter.search.toLowerCase()
    filteredPayments = payments.filter(
      (p: any) =>
        p.member?.name?.toLowerCase().includes(searchLower) ||
        p.member?.phone?.includes(filter.search!) ||
        p.member?.clientId?.includes(filter.search!) ||
        p.invoiceNumber?.toLowerCase().includes(searchLower),
    )
  }

  return serializeDocs(filteredPayments)
}

export async function getEmployees(filter: { search?: string; role?: string } = {}) {
  const db = await getDatabase()

  const query: any = {}
  if (filter.role && filter.role !== "All" && filter.role !== "all") {
    query.role = filter.role
  }
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { firstName: { $regex: filter.search, $options: "i" } },
      { lastName: { $regex: filter.search, $options: "i" } },
      { phone: { $regex: filter.search, $options: "i" } },
      { mobile: { $regex: filter.search, $options: "i" } },
      { email: { $regex: filter.search, $options: "i" } },
    ]
  }

  const employees = await db.collection("employees").find(query).sort({ createdAt: -1 }).toArray()

  return serializeDocs(employees)
}

export async function getEnquiriesStats() {
  const db = await getDatabase()

  const open = await db.collection("enquiries").countDocuments({ status: "Open" })
  const close = await db.collection("enquiries").countDocuments({ status: "Close" })
  const notInterested = await db.collection("enquiries").countDocuments({ status: "Not Interested" })
  const callDone = await db.collection("enquiries").countDocuments({ status: "Call Done" })
  const callNotConnected = await db.collection("enquiries").countDocuments({ status: "Call Not Connected" })

  return {
    open,
    close,
    notInterested,
    callDone,
    callNotConnected,
    total: open + close + notInterested + callDone + callNotConnected,
  }
}

export async function getEnquiries(filter: { status?: string; search?: string; leadType?: string } = {}) {
  const db = await getDatabase()

  const query: any = {}
  if (filter.status && filter.status !== "All" && filter.status !== "all") {
    query.status = filter.status
  }
  if (filter.leadType && filter.leadType !== "All" && filter.leadType !== "all") {
    query.leadType = filter.leadType
  }
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { phone: { $regex: filter.search, $options: "i" } },
      { enquiryNo: { $regex: filter.search, $options: "i" } },
    ]
  }

  const enquiries = await db.collection("enquiries").find(query).sort({ enquiryDate: -1 }).limit(50).toArray()

  return serializeDocs(enquiries)
}

export async function getAllFollowUps(filter: { type?: string; status?: string; search?: string } = {}) {
  const db = await getDatabase()

  const query: any = {}
  if (filter.type && filter.type !== "All" && filter.type !== "all") {
    query.type = filter.type
  }
  if (filter.status && filter.status !== "All" && filter.status !== "all") {
    query.status = filter.status
  }

  const followUps = await db
    .collection("followups")
    .aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: { path: "$member", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { dueDate: 1 },
      },
      {
        $limit: 100,
      },
    ])
    .toArray()

  let filteredFollowUps = followUps
  if (filter.search) {
    const searchLower = filter.search.toLowerCase()
    filteredFollowUps = followUps.filter(
      (f: any) =>
        f.member?.name?.toLowerCase().includes(searchLower) ||
        f.member?.phone?.includes(filter.search!) ||
        f.comment?.toLowerCase().includes(searchLower),
    )
  }

  return serializeDocs(filteredFollowUps)
}

export async function getBalanceDueReport(filter: { search?: string } = {}) {
  const db = await getDatabase()

  const payments = await db
    .collection("payments")
    .aggregate([
      {
        $match: { balance: { $gt: 0 } },
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: { path: "$member", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "membership",
        },
      },
      {
        $unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { dueDate: 1 },
      },
    ])
    .toArray()

  let filteredPayments = payments
  if (filter.search) {
    const searchLower = filter.search.toLowerCase()
    filteredPayments = payments.filter(
      (p: any) =>
        p.member?.name?.toLowerCase().includes(searchLower) ||
        p.member?.phone?.includes(filter.search!) ||
        p.member?.clientId?.includes(filter.search!),
    )
  }

  const stats = {
    totalPending: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum: number, p: any) => sum + (p.balance || 0), 0),
  }

  return { payments: serializeDocs(filteredPayments), stats }
}

export async function getSalesReport(filter: { startDate?: Date; endDate?: Date; search?: string } = {}) {
  const db = await getDatabase()

  const query: any = {}
  if (filter.startDate && filter.endDate) {
    query.invoiceDate = { $gte: filter.startDate, $lte: filter.endDate }
  }

  const payments = await db
    .collection("payments")
    .aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member",
        },
      },
      {
        $unwind: { path: "$member", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "membership",
        },
      },
      {
        $unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { invoiceDate: -1 },
      },
    ])
    .toArray()

  let filteredPayments = payments
  if (filter.search) {
    const searchLower = filter.search.toLowerCase()
    filteredPayments = payments.filter(
      (p: any) =>
        p.member?.name?.toLowerCase().includes(searchLower) ||
        p.member?.phone?.includes(filter.search!) ||
        p.member?.clientId?.includes(filter.search!),
    )
  }

  const stats = {
    invoiceGenerated: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum: number, p: any) => sum + (p.total || 0), 0),
    paidAmount: filteredPayments.reduce((sum: number, p: any) => sum + (p.paid || 0), 0),
    balanceAmount: filteredPayments.reduce((sum: number, p: any) => sum + (p.balance || 0), 0),
    cash: filteredPayments
      .filter((p: any) => p.paymentMode === "Cash")
      .reduce((sum: number, p: any) => sum + (p.paid || 0), 0),
    online: filteredPayments
      .filter((p: any) => p.paymentMode === "Online")
      .reduce((sum: number, p: any) => sum + (p.paid || 0), 0),
    cheque: filteredPayments
      .filter((p: any) => p.paymentMode === "Cheque")
      .reduce((sum: number, p: any) => sum + (p.paid || 0), 0),
    other: filteredPayments
      .filter((p: any) => p.paymentMode === "Other")
      .reduce((sum: number, p: any) => sum + (p.paid || 0), 0),
  }

  return { payments: serializeDocs(filteredPayments), stats }
}

export async function getMemberProfile(memberId: string) {
  const db = await getDatabase()
  const { ObjectId } = await import("mongodb")

  let objectId: any
  try {
    objectId = new ObjectId(memberId)
  } catch {
    return null
  }

  const member = await db.collection("members").findOne({ _id: objectId })

  if (!member) {
    return null
  }

  // Get all memberships for this member
  const memberships = await db
    .collection("payments")
    .aggregate([
      {
        $match: { memberId: objectId },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "membership",
        },
      },
      {
        $unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { invoiceDate: -1 },
      },
    ])
    .toArray()

  // Get PT packages for this member
  const ptPackages = await db.collection("personal_training").find({ memberId: objectId }).toArray()

  // Get follow ups
  const followUps = await db
    .collection("followups")
    .find({ memberId: objectId })
    .sort({ dueDate: -1 })
    .limit(10)
    .toArray()

  // Get payment history with membership lookup
  const payments = await db
    .collection("payments")
    .aggregate([
      {
        $match: { memberId: objectId },
      },
      {
        $lookup: {
          from: "memberships",
          localField: "membershipId",
          foreignField: "_id",
          as: "membership",
        },
      },
      {
        $unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
      },
      {
        $sort: { invoiceDate: -1 },
      },
    ])
    .toArray()

  return {
    member: serializeDoc(member),
    memberships: serializeDocs(memberships),
    ptPackages: serializeDocs(ptPackages),
    followUps: serializeDocs(followUps),
    payments: serializeDocs(payments),
  }
}

export async function getDashboardChartData() {
  const db = await getDatabase()

  const leadTypes = await db
    .collection("enquiries")
    .aggregate([
      {
        $group: {
          _id: "$leadType",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()

  const membersByMonth = await db
    .collection("members")
    .aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          activeCount: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
          },
          inactiveCount: {
            $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] },
          },
          upcomingCount: {
            $sum: { $cond: [{ $eq: ["$status", "Upcoming"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray()

  const financialData = await db
    .collection("payments")
    .aggregate([
      {
        $match: {
          invoiceDate: { $gte: new Date(new Date().getFullYear(), 0, 1) },
        },
      },
      {
        $group: {
          _id: { $month: "$invoiceDate" },
          paidAmount: { $sum: "$paid" },
          balanceAmount: { $sum: "$balance" },
          pendingPayment: {
            $sum: { $cond: [{ $gt: ["$balance", 0] }, "$balance", 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
    .toArray()

  return {
    leadTypes: serializeDocs(leadTypes),
    membersByMonth: serializeDocs(membersByMonth),
    financialData: serializeDocs(financialData),
  }
}
