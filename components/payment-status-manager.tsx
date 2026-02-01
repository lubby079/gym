"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Edit, Download } from "lucide-react"

interface PaymentStatusManagerProps {
  payment: any
  autoDownloadInvoice?: boolean
}

export function PaymentStatusManager({ payment, autoDownloadInvoice = false }: PaymentStatusManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paidAmount, setPaidAmount] = useState(payment.paid)
  const [balanceAmount, setBalanceAmount] = useState(payment.balance)
  const router = useRouter()
  const { toast } = useToast()

  const handleMarkAsPaid = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/payments/${payment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PAID",
          paid: payment.total,
          balance: 0,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment marked as paid",
        })

        if (autoDownloadInvoice) {
          setTimeout(() => {
            generateInvoice()
          }, 500)
        }

        setOpen(false)
        router.refresh()
      } else {
        throw new Error("Failed to update payment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePayment = async () => {
    setLoading(true)
    try {
      const total = payment.total
      const newPaid = Number(paidAmount)
      const newBalance = total - newPaid
      const newStatus = newBalance === 0 ? "PAID" : "BALANCE_DUE"

      const response = await fetch(`/api/payments/${payment._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          paid: newPaid,
          balance: newBalance,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment updated successfully",
        })

        if (newStatus === "PAID" && autoDownloadInvoice) {
          setTimeout(() => {
            generateInvoice()
          }, 500)
        }

        setOpen(false)
        router.refresh()
      } else {
        throw new Error("Failed to update payment")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateInvoice = () => {
    const invoiceData = {
      billNo: payment._id?.toString().slice(-8).toUpperCase() || "INV-0000",
      invoiceDate: new Date(payment.invoiceDate).toLocaleDateString("en-GB"),
      memberName: payment.member?.name || "N/A",
      clientId: payment.member?.clientId || "N/A",
      phone: payment.member?.phone || "N/A",
      email: payment.member?.email || "N/A",
      membershipName: payment.membership?.name || "N/A",
      duration: payment.membership?.duration ? `${payment.membership.duration} Months` : "N/A",
      sessions: "360/360",
      startDate: new Date(payment.invoiceDate).toLocaleDateString("en-GB"),
      endDate: payment.dueDate ? new Date(payment.dueDate).toLocaleDateString("en-GB") : "N/A",
      planAmount: payment.planAmount || 0,
      subTotal: payment.total || 0,
      discount: payment.discount || 0,
      amountPaid: payment.paid || 0,
      balanceAmount: payment.balance || 0,
      paymentMode: payment.paymentMode || "Cash",
      paymentDate: new Date(payment.invoiceDate).toLocaleDateString("en-GB"),
      receivedBy: "Raashid shaikh",
    }

    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #dc2626; margin: 0; font-size: 32px; }
    .info-section { margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background-color: #f3f4f6; }
    .totals { margin: 20px 0; }
    .totals-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px; border-bottom: 1px solid #eee; }
    .totals-row strong { font-weight: bold; }
    .payment-log { margin: 20px 0; }
    .terms { margin: 30px 0; font-size: 12px; }
    .signature { margin-top: 50px; }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>THE MASTER GYM</h1>
    <p style="font-size: 18px; margin: 10px 0;">Invoice</p>
  </div>
  
  <div class="info-section">
    <p><strong>Bill No:</strong> ${invoiceData.billNo}</p>
    <p><strong>Invoice Date:</strong> ${invoiceData.invoiceDate}</p>
  </div>

  <div class="info-section">
    <h3>Bill From: The Master Gym</h3>
    <p>Gomtipur, 2nd floor F.M. Gym Building, Royal Estate, Near Amrapali Cinema, Gomtipur, Ahmedabad, Gujarat, 380021</p>
    <p>Phone: 7096862686</p>
  </div>

  <div class="info-section">
    <h3>Bill To: ${invoiceData.memberName}</h3>
    <p><strong>Client ID:</strong> ${invoiceData.clientId}</p>
    <p><strong>Mobile Number:</strong> ${invoiceData.phone}</p>
    <p><strong>Email:</strong> ${invoiceData.email}</p>
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Plan Name</th>
        <th>Duration</th>
        <th>Sessions</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Plan Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>${invoiceData.membershipName}</td>
        <td>${invoiceData.duration}</td>
        <td>${invoiceData.sessions}</td>
        <td>${invoiceData.startDate}</td>
        <td>${invoiceData.endDate}</td>
        <td>₹${invoiceData.planAmount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Selected Plans Total:</span><span>₹${invoiceData.planAmount.toLocaleString()}</span></div>
    <div class="totals-row"><span>Sub Total:</span><span>₹${invoiceData.subTotal.toLocaleString()}</span></div>
    <div class="totals-row"><span>Payable Amount:</span><span>₹${invoiceData.subTotal.toLocaleString()}</span></div>
    <div class="totals-row"><span>SGST(0%):</span><span>₹0.00</span></div>
    <div class="totals-row"><span>Discount:</span><span>₹${invoiceData.discount.toLocaleString()}</span></div>
    <div class="totals-row"><span>CGST(0%):</span><span>₹0.00</span></div>
    <div class="totals-row"><span>Surcharge:</span><span>₹0.00</span></div>
    <div class="totals-row"><strong>Amount Paid:</strong><strong>₹${invoiceData.amountPaid.toLocaleString()}</strong></div>
    <div class="totals-row"><strong>Balance Amount:</strong><strong>₹${invoiceData.balanceAmount.toLocaleString()}</strong></div>
  </div>

  <div class="payment-log">
    <h3>Payment log</h3>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Invoice/ Receipt No</th>
          <th>Amount</th>
          <th>Amount Paid</th>
          <th>Payment Mode</th>
          <th>Payment Date</th>
          <th>Received by</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>${invoiceData.billNo}</td>
          <td>₹${invoiceData.subTotal.toLocaleString()}</td>
          <td>₹${invoiceData.amountPaid.toLocaleString()}</td>
          <td>${invoiceData.paymentMode}</td>
          <td>${invoiceData.paymentDate}</td>
          <td>${invoiceData.receivedBy}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="terms">
    <h3>Terms & conditions</h3>
    <ol>
      <li>Fees once paid will not be refundable, Nor - Extandable and Nor- Transferable.</li>
      <li>Outside Shoes Not allowed.</li>
      <li>This receipt confirms that you have accepted the terms and conditions of The Master's Gym.</li>
    </ol>
  </div>

  <div class="signature">
    <p><strong>Authorized by:</strong> Raashid shaikh</p>
    <p><strong>Member signature:</strong> __________________</p>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge
          variant={payment.status === "PAID" ? "default" : "destructive"}
          className={
            payment.status === "PAID"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-orange-500 bg-orange-50 text-orange-700"
          }
        >
          {payment.status === "PAID" ? "PAID" : "BALANCE DUE"}
        </Badge>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        {payment.status === "PAID" && (
          <Button variant="ghost" size="icon" onClick={generateInvoice}>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input value={`₹${payment.total.toLocaleString()}`} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paid">Paid Amount</Label>
              <Input
                id="paid"
                type="number"
                value={paidAmount}
                onChange={(e) => {
                  const paid = Number(e.target.value)
                  setPaidAmount(paid)
                  setBalanceAmount(payment.total - paid)
                }}
                max={payment.total}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label>Balance Amount</Label>
              <Input value={`₹${balanceAmount.toLocaleString()}`} disabled />
            </div>

            <div className="flex flex-col gap-2 pt-4">
              {payment.status !== "PAID" && (
                <Button onClick={handleMarkAsPaid} disabled={loading} className="w-full">
                  {loading ? "Processing..." : "Mark as Fully Paid"}
                </Button>
              )}
              <Button
                onClick={handleUpdatePayment}
                disabled={loading}
                variant="outline"
                className="w-full bg-transparent"
              >
                {loading ? "Updating..." : "Update Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
