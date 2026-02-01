import { getPayments } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Search, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ExportButton } from "@/components/export-button"
import { PaymentActionsMenu } from "@/components/payment-actions-menu"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; dueDate?: string; invoiceDate?: string; status?: string }>
}) {
  const params = await searchParams
  const payments = await getPayments({
    search: params.search,
    dueDate: params.dueDate,
    invoiceDate: params.invoiceDate,
    status: params.status,
  })

  const totalRevenue = payments.reduce((sum: number, p: any) => sum + (p.total || 0), 0)
  const totalPending = payments.filter((p: any) => p.status === "PENDING").length
  const totalRenewal = payments.filter((p: any) => p.member?.status === "Active").length
  const totalDuePaid = payments.filter((p: any) => p.status === "PAID").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Track all member payments and invoices</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Renewal Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRenewal}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due Paid Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDuePaid}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Payments List</CardTitle>
            <div className="flex flex-wrap gap-2">
              <form method="get" action="/payments" className="flex gap-2">
                <Select name="dueDate" defaultValue={params.dueDate || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Due Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
                <Select name="invoiceDate" defaultValue={params.invoiceDate || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Invoice Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1 md:min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="search" placeholder="Search payments..." className="pl-8" defaultValue={params.search} />
                </div>
                <Button type="submit">Apply</Button>
                <Link href="/payments">
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
                <TableHead>Invoice Date</TableHead>
                <TableHead>Name & Mob. No.</TableHead>
                <TableHead>Plan Total</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment: any) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">{payment.member?.clientId || "-"}</TableCell>
                    <TableCell>
                      {payment.invoiceDate ? format(new Date(payment.invoiceDate), "dd MMM, yyyy") : "-"}
                    </TableCell>
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
                    <TableCell>₹{(payment.planTotal || 0).toLocaleString()}</TableCell>
                    <TableCell className="font-semibold">₹{(payment.total || 0).toLocaleString()}</TableCell>
                    <TableCell>₹{(payment.discount || 0).toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{(payment.paid || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold">{payment.balance || 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={payment.status === "PAID" ? "default" : "secondary"}
                        className={
                          payment.status === "PAID"
                            ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                            : ""
                        }
                      >
                        {payment.status || "PENDING"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-orange-500 text-orange-700">
                        {payment.membership?.type || payment.membership?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.dueDate ? format(new Date(payment.dueDate), "dd MMM, yyyy") : "-"}</TableCell>
                    <TableCell>
                      <PaymentActionsMenu payment={payment} />
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
