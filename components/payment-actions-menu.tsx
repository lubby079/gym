"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Calendar, Mail, Edit, Trash2, Download } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { InvoiceGenerator } from "@/components/invoice-generator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaymentActionsMenuProps {
  payment: any
}

export function PaymentActionsMenu({ payment }: PaymentActionsMenuProps) {
  const router = useRouter()
  const [showInvoice, setShowInvoice] = useState(false)
  const [showEditDate, setShowEditDate] = useState(false)
  const [showEditPaymentDate, setShowEditPaymentDate] = useState(false)
  const [dateType, setDateType] = useState<"invoice" | "payment">("invoice")

  const handleViewInvoice = () => {
    setShowInvoice(true)
  }

  const handleDownloadInvoice = () => {
    window.print()
  }

  const handleChangeInvoiceDate = () => {
    setDateType("invoice")
    setShowEditDate(true)
  }

  const handleChangePaymentDate = () => {
    setDateType("payment")
    setShowEditPaymentDate(true)
  }

  const handleMailInvoice = async () => {
    // Implement email functionality
    alert("Email sent to " + payment.member.email)
  }

  const handleEditInvoice = () => {
    router.push(`/members/${payment.member._id}`)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this payment?")) {
      try {
        const response = await fetch(`/api/payments/${payment._id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          router.refresh()
        }
      } catch (error) {
        console.error("Error deleting payment:", error)
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleViewInvoice}>
            <Eye className="mr-2 h-4 w-4" />
            View Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadInvoice}>
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleChangeInvoiceDate}>
            <Calendar className="mr-2 h-4 w-4" />
            Change Invoice Date
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleChangePaymentDate}>
            <Calendar className="mr-2 h-4 w-4" />
            Change Payment Date
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleMailInvoice}>
            <Mail className="mr-2 h-4 w-4" />
            Mail Invoice
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditInvoice}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Invoice
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceGenerator payment={payment} />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDate} onOpenChange={setShowEditDate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Invoice Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">New Invoice Date</Label>
              <Input id="invoiceDate" type="date" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDate(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowEditDate(false)}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditPaymentDate} onOpenChange={setShowEditPaymentDate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Payment Date</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDate">New Payment Date</Label>
              <Input id="paymentDate" type="date" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditPaymentDate(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowEditPaymentDate(false)}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
