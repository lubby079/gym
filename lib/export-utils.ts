export function exportToXLS(data: any[], filename: string, columns: { key: string; header: string }[]) {
  // Create CSV content
  const headers = columns.map((col) => col.header).join(",")
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.key]
        // Handle values with commas by wrapping in quotes
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`
        }
        return value ?? ""
      })
      .join(","),
  )

  const csv = [headers, ...rows].join("\n")

  // Create blob and download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportMembersToXLS(members: any[]) {
  const columns = [
    { key: "clientId", header: "Client ID" },
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "gender", header: "Gender" },
    { key: "status", header: "Status" },
    { key: "joiningDate", header: "Joining Date" },
    { key: "expiryDate", header: "Expiry Date" },
  ]

  const formattedData = members.map((m) => ({
    ...m,
    joiningDate: new Date(m.joiningDate).toLocaleDateString(),
    expiryDate: m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "-",
  }))

  exportToXLS(formattedData, "members-report", columns)
}

export function exportPaymentsToXLS(payments: any[]) {
  const columns = [
    { key: "clientId", header: "Client ID" },
    { key: "memberName", header: "Member Name" },
    { key: "phone", header: "Phone" },
    { key: "invoiceDate", header: "Invoice Date" },
    { key: "membershipType", header: "Membership Type" },
    { key: "planTotal", header: "Plan Total" },
    { key: "total", header: "Total" },
    { key: "discount", header: "Discount" },
    { key: "paid", header: "Paid" },
    { key: "balance", header: "Balance" },
    { key: "status", header: "Status" },
    { key: "paymentMode", header: "Payment Mode" },
  ]

  const formattedData = payments.map((p) => ({
    clientId: p.member.clientId,
    memberName: p.member.name,
    phone: p.member.phone,
    invoiceDate: new Date(p.invoiceDate).toLocaleDateString(),
    membershipType: p.membership.type,
    planTotal: p.planTotal,
    total: p.total,
    discount: p.discount,
    paid: p.paid,
    balance: p.balance,
    status: p.status,
    paymentMode: p.paymentMode || "Cash",
  }))

  exportToXLS(formattedData, "payments-report", columns)
}

export function exportEnquiriesToXLS(enquiries: any[]) {
  const columns = [
    { key: "enquiryNo", header: "Enquiry No" },
    { key: "enquiryDate", header: "Enquiry Date" },
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "leadType", header: "Lead Type" },
    { key: "trialBooked", header: "Trial Booked" },
    { key: "status", header: "Status" },
    { key: "createdBy", header: "Created By" },
  ]

  const formattedData = enquiries.map((e) => ({
    ...e,
    enquiryDate: new Date(e.enquiryDate).toLocaleDateString(),
    trialBooked: e.trialBooked ? "Yes" : "No",
  }))

  exportToXLS(formattedData, "enquiries-report", columns)
}

export function exportEmployeesToXLS(employees: any[]) {
  const columns = [
    { key: "employeeId", header: "Employee ID" },
    { key: "name", header: "Name" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "joiningDate", header: "Joining Date" },
    { key: "salary", header: "Salary" },
    { key: "status", header: "Status" },
  ]

  const formattedData = employees.map((e) => ({
    ...e,
    joiningDate: new Date(e.joiningDate).toLocaleDateString(),
    salary: e.salary || "-",
  }))

  exportToXLS(formattedData, "employees-report", columns)
}
