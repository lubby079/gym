import { getEnquiriesStats, getEnquiries } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { format } from "date-fns"
import { NewEnquiryDialog } from "@/components/new-enquiry-dialog"
import { ExportButton } from "@/components/export-button"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; leadType?: string; trialBooked?: string; gender?: string; status?: string }>
}) {
  const params = await searchParams
  const stats = await getEnquiriesStats()
  const enquiries = await getEnquiries({
    search: params.search,
    leadType: params.leadType,
    status: params.status,
  })

  let filteredEnquiries = enquiries

  if (params.trialBooked && params.trialBooked !== "all") {
    filteredEnquiries = filteredEnquiries.filter((e: any) => e.trialBooked === (params.trialBooked === "yes"))
  }

  if (params.gender && params.gender !== "all") {
    filteredEnquiries = filteredEnquiries.filter((e: any) => e.gender === params.gender)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Enquiry</h1>
        <NewEnquiryDialog>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Enquiry
          </Button>
        </NewEnquiryDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Enquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Close Enquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.close}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Not Interested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.notInterested}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Call Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.callDone}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Call Not Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.callNotConnected}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Enquiry Ratio</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <form method="get" action="/enquiries" className="flex flex-wrap gap-3">
        <Select name="handleBy" defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Handle by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Select name="leadType" defaultValue={params.leadType || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lead Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Hot">Hot</SelectItem>
            <SelectItem value="Warm">Warm</SelectItem>
            <SelectItem value="Cold">Cold</SelectItem>
          </SelectContent>
        </Select>

        <Select name="trialBooked" defaultValue={params.trialBooked || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trial Booked" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>

        <Select name="gender" defaultValue={params.gender || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
          </SelectContent>
        </Select>

        <Select name="status" defaultValue={params.status || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Close">Close</SelectItem>
            <SelectItem value="Not Interested">Not Interested</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-primary">
          Apply
        </Button>
        <Link href="/enquiries">
          <Button type="button" variant="outline">
            Clear
          </Button>
        </Link>
      </form>

      <div className="flex items-center justify-between gap-3">
        <form method="get" action="/enquiries" className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="search" placeholder="Search" className="pl-10" defaultValue={params.search} />
        </form>
        <ExportButton type="enquiries" data={filteredEnquiries} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enquiry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-medium">Enquiry No.</th>
                  <th className="p-3 text-left text-sm font-medium">Enquiry Date</th>
                  <th className="p-3 text-left text-sm font-medium">Name & Mob. No.</th>
                  <th className="p-3 text-left text-sm font-medium">Trial Booked</th>
                  <th className="p-3 text-left text-sm font-medium">Handle by</th>
                  <th className="p-3 text-left text-sm font-medium">Lead Type</th>
                  <th className="p-3 text-left text-sm font-medium">Remark/Summary</th>
                  <th className="p-3 text-left text-sm font-medium">Created By</th>
                  <th className="p-3 text-left text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnquiries.map((enquiry: any) => (
                  <tr key={enquiry._id} className="border-b">
                    <td className="p-3">{enquiry.enquiryNo}</td>
                    <td className="p-3">{format(new Date(enquiry.enquiryDate), "dd MMM, yyyy")}</td>
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{enquiry.name}</p>
                        <p className="text-sm text-muted-foreground">{enquiry.phone}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={enquiry.trialBooked ? "default" : "destructive"}>
                        {enquiry.trialBooked ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="p-3">{enquiry.handleBy || "-"}</td>
                    <td className="p-3">
                      {enquiry.leadType && (
                        <Badge
                          variant={
                            enquiry.leadType === "Hot"
                              ? "destructive"
                              : enquiry.leadType === "Warm"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {enquiry.leadType}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 max-w-xs truncate">{enquiry.remark || "-"}</td>
                    <td className="p-3">{enquiry.createdBy}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </td>
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
