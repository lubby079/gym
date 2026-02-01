import { getSalesReport } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, DollarSign, TrendingUp, Wallet, CreditCard } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import Link from "next/link"
import { ExportButton } from "@/components/export-button"

export const dynamic = "force-dynamic"

export default async function SalesReportPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; dateRange?: string; paymentMode?: string }>
}) {
  const params = await searchParams

  // Calculate date range
  let startDate, endDate
  const now = new Date()

  if (params.dateRange === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  } else if (params.dateRange === "week") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    endDate = new Date()
  } else if (params.dateRange === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date()
  }

  const { payments: allPayments, stats } = await getSalesReport({
    startDate,
    endDate,
    search: params.search,
  })

  // Filter by payment mode
  let payments = allPayments
  if (params.paymentMode && params.paymentMode !== "all") {
    payments = allPayments.filter((p: any) => p.paymentMode?.toLowerCase() === params.paymentMode)
  }

  const totalInvoices = payments.length
  const totalAmount = payments.reduce((sum: number, p: any) => sum + (p.total || 0), 0)
  const paidAmount = payments.reduce((sum: number, p: any) => sum + (p.paid || 0), 0)
  const balanceAmount = payments.reduce((sum: number, p: any) => sum + (p.balance || 0), 0)

  const cashPayments = allPayments.filter((p: any) => p.paymentMode === "Cash")
  const cashTotal = cashPayments.reduce((sum: number, p: any) => sum + (p.paid || 0), 0)

  const onlinePayments = allPayments.filter((p: any) => p.paymentMode === "Online")
  const onlineTotal = onlinePayments.reduce((sum: number, p: any) => sum + (p.paid || 0), 0)

  const chequePayments = allPayments.filter((p: any) => p.paymentMode === "Cheque")
  const chequeTotal = chequePayments.reduce((sum: number, p: any) => sum + (p.paid || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Report</h1>
          <p className="text-muted-foreground">Comprehensive sales and revenue analytics</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{balanceAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0.00</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{onlineTotal.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet</CardTitle>
            <Wallet className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹0.00</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash</CardTitle>
            <DollarSign className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{cashTotal.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cheque</CardTitle>
            <CreditCard className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{chequeTotal.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Sales Report</CardTitle>
            <div className="flex flex-wrap gap-2">
              <form method="get" action="/reports/sales" className="flex gap-2">
                <Select name="dateRange" defaultValue={params.dateRange || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="paymentMode" defaultValue={params.paymentMode || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1 md:min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="search" placeholder="Search..." className="pl-8" defaultValue={params.search} />
                </div>
                <Button type="submit">Apply</Button>
                <Link href="/reports/sales">
                  <Button type="button" variant="outline">
                    Clear
                  </Button>
                </Link>
              </form>
              <ExportButton type="payments" data={payments} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Id</TableHead>
                <TableHead>Name & Number</TableHead>
                <TableHead>Membership Type</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No sales data found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: any) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">{payment.member?.clientId || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {payment.member?._id ? (
                          <Link
                            href={`/members/${payment.member._id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {payment.member?.name || "Unknown"}
                          </Link>
                        ) : (
                          <span className="font-medium">{payment.member?.name || "Unknown"}</span>
                        )}
                        <span className="text-sm text-muted-foreground">{payment.member?.phone || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-orange-500 text-orange-700">
                        {payment.membership?.type || payment.membership?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-orange-500 text-orange-700">
                        {payment.membership?.packageName || payment.membership?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.invoiceDate ? format(new Date(payment.invoiceDate), "dd MMM, yyyy") : "-"}
                    </TableCell>
                    <TableCell>{payment.membership?.duration || "-"} Months</TableCell>
                    <TableCell className="font-medium text-blue-600">{payment.invoiceNumber || "-"}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{(payment.paid || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{payment.paymentMode || "Cash"}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
