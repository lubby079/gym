import { getAllFollowUps } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { ExportButton } from "@/components/export-button"

export const dynamic = "force-dynamic"

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; status?: string }>
}) {
  const params = await searchParams
  const followUps = await getAllFollowUps({
    type: params.type,
    status: params.status,
    search: params.search,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Follow Ups</h1>
      </div>

      <form method="get" action="/follow-ups" className="flex flex-wrap gap-3">
        <Select name="type" defaultValue={params.type || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Follow Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Balance Due">Balance Due</SelectItem>
            <SelectItem value="Membership Renewal">Membership Renewal</SelectItem>
            <SelectItem value="Birthday">Birthday</SelectItem>
          </SelectContent>
        </Select>

        <Select name="convertibleType" defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Convertible Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Select name="status" defaultValue={params.status || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Hot">Hot</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select name="allocate" defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Allocate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Select name="allocateToMe" defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Allocate To Me" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-primary">
          Apply
        </Button>
        <Link href="/follow-ups">
          <Button type="button" variant="outline">
            Clear
          </Button>
        </Link>
      </form>

      <div className="flex items-center justify-between gap-3">
        <form method="get" action="/follow-ups" className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="search" placeholder="Search" className="pl-10" defaultValue={params.search} />
        </form>
        <ExportButton type="followups" data={followUps} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Follow Ups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-medium">Follow Up Date & Time</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Follow Up Type</th>
                  <th className="p-3 text-left text-sm font-medium">Name & Number</th>
                  <th className="p-3 text-left text-sm font-medium">Allocate</th>
                  <th className="p-3 text-left text-sm font-medium">Scheduled By</th>
                  <th className="p-3 text-left text-sm font-medium">Convertibility Status</th>
                  <th className="p-3 text-left text-sm font-medium">Comment</th>
                </tr>
              </thead>
              <tbody>
                {followUps.map((followUp: any) => (
                  <tr key={followUp._id} className="border-b">
                    <td className="p-3">{format(new Date(followUp.dueDate), "dd MMM, yyyy HH:mm a")}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          followUp.status === "Hot"
                            ? "destructive"
                            : followUp.status === "Done"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {followUp.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{followUp.type}</Badge>
                    </td>
                    <td className="p-3">
                      <div>
                        <Link
                          href={`/members/${followUp.member._id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {followUp.member.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{followUp.member.phone}</p>
                      </div>
                    </td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                    <td className="p-3">
                      <Badge variant="destructive">PENDING</Badge>
                    </td>
                    <td className="p-3 max-w-xs truncate">{followUp.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
