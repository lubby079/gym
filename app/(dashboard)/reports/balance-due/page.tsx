import { getBalanceDueReport } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import Link from "next/link"
import { ExportButton } from "@/components/export-button"

export const dynamic = "force-dynamic"

export default async function BalanceDueReportPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; dateFilter?: string }>
}) {
  const params = await searchParams
  const { payments: allPayments, stats } = await getBalanceDueReport({ search: params.search })

  let balanceDuePayments = allPayments
  if (params.dateFilter === "overdue") {
    balanceDuePayments = allPayments.filter((p: any) => p.dueDate && new Date(p.dueDate) < new Date())
  } else if (params.dateFilter === "upcoming") {
    balanceDuePayments = allPayments.filter(
      (p: any) =>
        p.dueDate &&
        new Date(p.dueDate) >= new Date() &&
        new Date(p.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    )
  }

  const totalDue = balanceDuePayments.reduce((sum: number, p: any) => sum + p.balance, 0)
  const overdueCount = allPayments.filter((p: any) => p.dueDate && new Date(p.dueDate) < new Date()).length
  const upcomingCount = allPayments.filter(
    (p: any) =>
      p.dueDate &&
      new Date(p.dueDate) >= new Date() &&
      new Date(p.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Balance Due Report</h1>
          <p className="text-muted-foreground">Track all outstanding payments and dues</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/10 to-red-600/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{balanceDuePayments.length} pending payments</p>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
            <p className="text-xs text-muted-foreground">Due within 7 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Balance Due List</CardTitle>
            <div className="flex flex-wrap gap-2">
              <form method="get" action="/reports/balance-due" className="flex gap-2">
                <Select name="dateFilter" defaultValue={params.dateFilter || "all"}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative flex-1 md:min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="search" placeholder="Search..." className="pl-8" defaultValue={params.search} />
                </div>
                <Button type="submit">Apply</Button>
                <Link href="/reports/balance-due">
                  <Button type="button" variant="outline">
                    Clear
                  </Button>
                </Link>
              </form>
              <ExportButton type="payments" data={balanceDuePayments} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Id</TableHead>
                <TableHead>Name & Mob. No.</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Balance Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balanceDuePayments.map((payment: any) => {
                const isOverdue = payment.dueDate && new Date(payment.dueDate) < new Date()
                return (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">{payment.member.clientId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/members/${payment.member._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {payment.member.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">{payment.member.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-blue-600">{payment.invoiceNumber}</TableCell>
                    <TableCell>{format(new Date(payment.invoiceDate), "dd MMM, yyyy")}</TableCell>
                    <TableCell className="font-semibold">₹{payment.total.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">₹{payment.paid.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-red-600">₹{payment.balance.toLocaleString()}</TableCell>
                    <TableCell>
                      {payment.dueDate ? (
                        <span className={isOverdue ? "text-red-600" : ""}>
                          {format(new Date(payment.dueDate), "dd MMM, yyyy")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isOverdue ? "destructive" : "secondary"}>
                        {isOverdue ? "Overdue" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
