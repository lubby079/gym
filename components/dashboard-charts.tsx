"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts"

const COLORS = {
  hot: "#ef4444",
  warm: "#f97316",
  cold: "#3b82f6",
}

const CHART_COLORS = {
  active: "#10b981",
  inactive: "#ef4444",
  upcoming: "#f59e0b",
  paidAmount: "#06b6d4",
  balanceAmount: "#84cc16",
  pendingPayment: "#f97316",
  totalExpenses: "#ef4444",
  totalProfit: "#10b981",
}

interface DashboardChartsProps {
  leadTypes: Array<{ _id: string; count: number }>
  membersByMonth: Array<{ _id: number; activeCount: number; inactiveCount: number; upcomingCount: number }>
  financialData: Array<{ _id: number; paidAmount: number; balanceAmount: number; pendingPayment: number }>
}

export function DashboardCharts({ leadTypes, membersByMonth, financialData }: DashboardChartsProps) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Transform lead types data for pie chart
  const pieData = leadTypes.map((item) => ({
    name: item._id === "Hot" ? "Hot Leads" : item._id === "Warm" ? "Warm Leads" : "Cold Leads",
    value: item.count,
    color: item._id === "Hot" ? COLORS.hot : item._id === "Warm" ? COLORS.warm : COLORS.cold,
  }))

  const totalLeads = pieData.reduce((sum, item) => sum + item.value, 0)

  // Transform members data for bar chart
  const membersChartData = months.map((month, index) => {
    const data = membersByMonth.find((m) => m._id === index + 1)
    return {
      month,
      active: data?.activeCount || 0,
      inactive: data?.inactiveCount || 0,
      upcoming: data?.upcomingCount || 0,
    }
  })

  // Transform financial data for line chart
  const financialChartData = months.map((month, index) => {
    const data = financialData.find((f) => f._id === index + 1)
    return {
      month,
      paidAmount: data?.paidAmount || 0,
      balanceAmount: data?.balanceAmount || 0,
      pendingPayment: data?.pendingPayment || 0,
      totalExpenses: 0,
      totalProfit: data?.paidAmount || 0,
    }
  })

  const financialTotals = {
    totalRevenue: financialData.reduce((sum, f) => sum + f.paidAmount, 0),
    pendingPayment: financialData.reduce((sum, f) => sum + f.pendingPayment, 0),
    totalExpenses: 0,
    totalProfit: financialData.reduce((sum, f) => sum + f.paidAmount, 0),
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">Members Overview</div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Types Pie Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lead Types</CardTitle>
              <Select defaultValue="thisyear">
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisyear">This year</SelectItem>
                  <SelectItem value="lastmonth">Last month</SelectItem>
                  <SelectItem value="thismonth">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                    {totalLeads}
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Members Counting by Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Members Counting by Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">
                  Active Members: {membersByMonth.reduce((sum, m) => sum + m.activeCount, 0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">
                  Inactive Members: {membersByMonth.reduce((sum, m) => sum + m.inactiveCount, 0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                <span className="text-sm">
                  Upcoming Members: {membersByMonth.reduce((sum, m) => sum + m.upcomingCount, 0)}
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={membersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active" fill={CHART_COLORS.active} />
                <Bar dataKey="inactive" fill={CHART_COLORS.inactive} />
                <Bar dataKey="upcoming" fill={CHART_COLORS.upcoming} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Analytics */}
      <div className="text-lg font-semibold">Financial Analytics</div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-cyan-500" />
              <span>Paid Amount</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-lime-500" />
              <span>Paid Balance Amount</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span>Pending Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>Total Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>Total Profit</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={financialChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="paidAmount" stroke={CHART_COLORS.paidAmount} strokeWidth={2} />
              <Line type="monotone" dataKey="balanceAmount" stroke={CHART_COLORS.balanceAmount} strokeWidth={2} />
              <Line type="monotone" dataKey="pendingPayment" stroke={CHART_COLORS.pendingPayment} strokeWidth={2} />
              <Line type="monotone" dataKey="totalExpenses" stroke={CHART_COLORS.totalExpenses} strokeWidth={2} />
              <Line type="monotone" dataKey="totalProfit" stroke={CHART_COLORS.totalProfit} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10">
              <CardContent className="pt-6">
                <div className="text-sm text-cyan-600">Total Revenue</div>
                <div className="text-2xl font-bold">₹{financialTotals.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10">
              <CardContent className="pt-6">
                <div className="text-sm text-orange-600">Pending Payment</div>
                <div className="text-2xl font-bold">₹{financialTotals.pendingPayment.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10">
              <CardContent className="pt-6">
                <div className="text-sm text-red-600">Total Expenses</div>
                <div className="text-2xl font-bold">₹{financialTotals.totalExpenses.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10">
              <CardContent className="pt-6">
                <div className="text-sm text-green-600">Total Profit</div>
                <div className="text-2xl font-bold">₹{financialTotals.totalProfit.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
