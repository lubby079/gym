"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface InvoiceData {
  billNo: string
  invoiceDate: string
  memberName: string
  clientId: string
  phone: string
  email: string
  membershipName: string
  duration: string
  sessions: string
  startDate: string
  endDate: string
  planAmount: number
  subTotal: number
  discount: number
  amountPaid: number
  balanceAmount: number
  paymentMode: string
  paymentDate: string
  receivedBy: string
}

export function InvoiceGenerator({ data }: { data: InvoiceData }) {
  const generatePDF = () => {
    const printContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { color: #dc2626; margin: 0; }
    .info-section { margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .table th { background-color: #f3f4f6; }
    .totals { margin: 20px 0; }
    .totals-row { display: flex; justify-content: space-between; margin: 8px 0; }
    .payment-log { margin: 20px 0; }
    .terms { margin: 30px 0; font-size: 12px; }
    .signature { margin-top: 50px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>THE MASTER GYM</h1>
    <p>Invoice</p>
  </div>
  
  <div class="info-section">
    <p><strong>Bill No:</strong> ${data.billNo}</p>
    <p><strong>Invoice Date:</strong> ${data.invoiceDate}</p>
  </div>

  <div class="info-section">
    <h3>Bill From: The Master Gym</h3>
    <p>Gomtipur, 2nd floor F.M. Gym Building, Royal Estate, Near Amrapali Cinema, Gomtipur, Ahmedabad, Gujarat, 38002</p>
    <p>7096862686</p>
  </div>

  <div class="info-section">
    <h3>Bill To: ${data.memberName}</h3>
    <p><strong>Client ID:</strong> ${data.clientId}</p>
    <p><strong>Mobile Number:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
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
        <td>${data.membershipName}</td>
        <td>${data.duration}</td>
        <td>${data.sessions}</td>
        <td>${data.startDate}</td>
        <td>${data.endDate}</td>
        <td>₹${data.planAmount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row"><span>Selected Plans Total:</span><span>₹${data.planAmount.toLocaleString()}</span></div>
    <div class="totals-row"><span>Sub Total:</span><span>₹${data.subTotal.toLocaleString()}</span></div>
    <div class="totals-row"><span>Payable Amount:</span><span>₹${data.subTotal.toLocaleString()}</span></div>
    <div class="totals-row"><span>SGST(0%):</span><span>₹0.00</span></div>
    <div class="totals-row"><span>Discount:</span><span>₹${data.discount.toLocaleString()}</span></div>
    <div class="totals-row"><span>Amount Paid:</span><span>₹${data.amountPaid.toLocaleString()}</span></div>
    <div class="totals-row"><span>CGST(0%):</span><span>₹0.00</span></div>
    <div class="totals-row"><span>Surcharge(%):</span><span>₹0.00</span></div>
    <div class="totals-row"><span>Balance Amount:</span><span>₹${data.balanceAmount.toLocaleString()}</span></div>
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
          <td>${data.billNo}</td>
          <td>₹${data.subTotal.toLocaleString()}</td>
          <td>₹${data.amountPaid.toLocaleString()}</td>
          <td>${data.paymentMode}</td>
          <td>${data.paymentDate}</td>
          <td>${data.receivedBy}</td>
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
    <p><strong>Member signature:</strong> --------------</p>
  </div>
</body>
</html>
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={generatePDF}>
      <Download className="mr-2 h-4 w-4" />
      Download Invoice
    </Button>
  )
}
