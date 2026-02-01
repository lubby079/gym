import { getMembers } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { AddPTDialog } from "@/components/add-pt-dialog"
import Link from "next/link"
import { ExportButton } from "@/components/export-button"

export const dynamic = "force-dynamic"

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const params = await searchParams
  const members = await getMembers({ status: params.status, search: params.search })

  const activeCount = members.filter((m) => m.status === "Active").length
  const inactiveCount = members.filter((m) => m.status === "Inactive").length
  const pastCount = members.filter((m) => m.status === "Past").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Management</h1>
          <p className="text-muted-foreground">Manage all gym members and their memberships</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Past Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastCount}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today Absents</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Members List</CardTitle>
            <div className="flex flex-wrap gap-2">
              <form method="get" action="/members" className="flex gap-2">
                <div className="relative flex-1 md:min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="search" placeholder="Search members..." className="pl-8" defaultValue={params.search} />
                </div>
                <Select name="status" defaultValue={params.status || "All"}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Past">Past</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">Apply</Button>
              </form>
              <ExportButton type="members" data={members} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client ID</TableHead>
                <TableHead>Name & Mobile No.</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member._id?.toString()}>
                  <TableCell className="font-medium">{member.clientId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Link
                        href={`/members/${member._id?.toString()}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {member.name}
                      </Link>
                      <span className="text-sm text-muted-foreground">{member.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "Active" ? "default" : member.status === "Past" ? "secondary" : "outline"
                      }
                      className={
                        member.status === "Active"
                          ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
                          : ""
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(member.joiningDate), "dd MMM, yyyy")}</TableCell>
                  <TableCell>{member.expiryDate ? format(new Date(member.expiryDate), "dd MMM, yyyy") : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/members/${member._id?.toString()}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      {member.status === "Active" && (
                        <AddPTDialog memberId={member._id?.toString() || ""} memberName={member.name} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
