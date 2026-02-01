"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { exportMembersToXLS, exportPaymentsToXLS, exportEnquiriesToXLS, exportEmployeesToXLS } from "@/lib/export-utils"

interface ExportButtonProps {
  type: "members" | "payments" | "enquiries" | "employees"
  data: any[]
}

export function ExportButton({ type, data }: ExportButtonProps) {
  const handleExport = () => {
    switch (type) {
      case "members":
        exportMembersToXLS(data)
        break
      case "payments":
        exportPaymentsToXLS(data)
        break
      case "enquiries":
        exportEnquiriesToXLS(data)
        break
      case "employees":
        exportEmployeesToXLS(data)
        break
    }
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Generate XLS Report
    </Button>
  )
}
