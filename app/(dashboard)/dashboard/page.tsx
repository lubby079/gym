import { getDashboardStats, getRecentFollowUps, getDashboardChartData } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, DollarSign, Calendar, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { NewSaleDialog } from "@/components/new-sale-dialog"
import { NewEnquiryDialog } from "@/components/new-enquiry-dialog"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DashboardCharts } from "@/components/dashboard-charts"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams
  const stats = await getDashboardStats()
  const followUps = await getRecentFollowUps()
  const chartData = await getDashboardChartData()

  let filteredFollowUps = followUps
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredFollowUps = followUps.filter(
      (f: any) =>
        f.member.name.toLowerCase().includes(searchLower) ||
        f.member.phone.includes(searchLower) ||
        f.comment.toLowerCase().includes(searchLower),
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <form method="get" action="/dashboard" className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              placeholder='Search & Create "New Sales"'
              className="pl-10"
              defaultValue={params.search}
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
          <NewSaleDialog />
          <NewEnquiryDialog />
        </form>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to The Master Gym Management System</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members.total}</div>
            <p className="text-xs text-muted-foreground">All registered members</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members.upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">Due within 7 days</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow Ups</CardTitle>
            <AlertCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.followUps}</div>
            <p className="text-xs text-muted-foreground">Pending follow ups</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-teal-500/10 to-teal-600/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.sales.total.amount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.sales.total.count} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fresh Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.sales.fresh.amount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.sales.fresh.count} this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Payment</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-bold text-green-600">₹{stats.balance.paid.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Paid</p>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">₹{stats.balance.due.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Due</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Follow Ups ({filteredFollowUps.length})</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredFollowUps.length === 0 ? (
            <p className="text-center text-muted-foreground">No pending follow ups</p>
          ) : (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp: any) => (
                <div key={followUp._id.toString()} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/members/${followUp.member._id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {followUp.member.name} - {followUp.member.phone}
                      </Link>
                      <Badge variant={followUp.status === "Hot" ? "destructive" : "secondary"}>{followUp.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{followUp.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      Due: {format(new Date(followUp.dueDate), "dd MMM, yyyy")}
                    </p>
                  </div>
                  <Badge variant="outline">{followUp.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Added charts below follow-ups section */}
      <DashboardCharts
        leadTypes={chartData.leadTypes}
        membersByMonth={chartData.membersByMonth}
        financialData={chartData.financialData}
      />
    </div>
  )
}
