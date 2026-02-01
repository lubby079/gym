import { getMemberProfile } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Phone, Mail, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { AddPTDialog } from "@/components/add-pt-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentStatusManager } from "@/components/payment-status-manager"
import { Button } from "@/components/ui/button"
import { EditMemberDialog } from "@/components/edit-member-dialog"

export const dynamic = "force-dynamic"

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getMemberProfile(id)

  if (!profile) {
    notFound()
  }

  const { member, memberships, ptPackages, followUps, payments } = profile

  const totalMembershipPaid = payments.reduce((sum: number, p: any) => sum + p.paid, 0)
  const totalPTAmount = ptPackages.reduce((sum: number, pt: any) => sum + pt.amount, 0)
  const grandTotal = totalMembershipPaid + totalPTAmount
  const totalBalance = payments.reduce((sum: number, p: any) => sum + p.balance, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/members">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Members Profile</h1>
          <p className="text-muted-foreground">{member.name}</p>
        </div>
        <EditMemberDialog member={{ ...member, _id: member._id || id }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-black text-3xl font-bold text-white">
              {member.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">Client ID: {member.clientId}</p>
            </div>
            <Button className="w-full bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add to New Sale
            </Button>
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
              {member.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>DOB: {member.birthDate ? format(new Date(member.birthDate), "dd-MM-yyyy") : "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Memberships</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 rounded-lg border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{member.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email ID</p>
                <p className="font-medium">{member.email || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DOB</p>
                <p className="font-medium">
                  {member.birthDate ? format(new Date(member.birthDate), "dd-MM-yyyy") : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Anniversary Date</p>
                <p className="font-medium">-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emergency Contact Name</p>
                <p className="font-medium">-</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Emergency Contact No</p>
                <p className="font-medium">-</p>
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="active">Active Membership</TabsTrigger>
                <TabsTrigger value="past">Past Membership</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Membership</TabsTrigger>
                <TabsTrigger value="transferred">Transferred</TabsTrigger>
                <TabsTrigger value="freeze">Freeze</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="space-y-4">
                <div className="text-sm font-medium">Active Membership</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Membership ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Add On Days</TableHead>
                      <TableHead>Add On Days Remark</TableHead>
                      <TableHead>Assigned Trainer</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships
                      .filter((m: any) => m.status === "PAID" || m.status === "BALANCE_DUE")
                      .map((membership: any) => (
                        <TableRow key={membership._id?.toString()}>
                          <TableCell>{membership._id?.toString().slice(-6)}</TableCell>
                          <TableCell>{membership.membership?.name || "-"}</TableCell>
                          <TableCell>{membership.membership?.duration || "-"} Months</TableCell>
                          <TableCell>360/360</TableCell>
                          <TableCell>{format(new Date(membership.invoiceDate), "dd MMM, yyyy")}</TableCell>
                          <TableCell>
                            {membership.dueDate ? format(new Date(membership.dueDate), "dd MMM, yyyy") : "-"}
                          </TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>-</TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Personal Training Section */}
      {ptPackages.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Personal Training Packages</CardTitle>
              <AddPTDialog memberId={id} memberName={member.name} />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ptPackages.map((pt: any) => (
                  <TableRow key={pt._id?.toString()}>
                    <TableCell className="font-medium">{pt.packageName}</TableCell>
                    <TableCell>{pt.duration} Months</TableCell>
                    <TableCell>{pt.sessions}</TableCell>
                    <TableCell className="font-semibold text-primary">₹{pt.amount.toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(pt.startDate), "dd MMM, yyyy")}</TableCell>
                    <TableCell>{format(new Date(pt.endDate), "dd MMM, yyyy")}</TableCell>
                    <TableCell>
                      <Badge variant={pt.status === "Active" ? "default" : "secondary"}>{pt.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Membership Amount</p>
              <p className="text-2xl font-bold">₹{totalMembershipPaid.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total PT Amount</p>
              <p className="text-2xl font-bold text-primary">+ ₹{totalPTAmount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Grand Total</p>
              <p className="text-2xl font-bold text-green-600">₹{grandTotal.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Balance Due</p>
              <p className="text-2xl font-bold text-red-600">₹{totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Section */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: any) => (
                  <TableRow key={payment._id?.toString()}>
                    <TableCell>{format(new Date(payment.invoiceDate), "dd MMM, yyyy")}</TableCell>
                    <TableCell>{payment.membership?.name || "-"}</TableCell>
                    <TableCell className="font-semibold">₹{payment.total?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-green-600">₹{payment.paid?.toLocaleString() || 0}</TableCell>
                    <TableCell className="text-red-600">₹{payment.balance?.toLocaleString() || 0}</TableCell>
                    <TableCell>{payment.paymentMode || "Cash"}</TableCell>
                    <TableCell>
                      <PaymentStatusManager
                        payment={{ ...payment, _id: payment._id?.toString() }}
                        autoDownloadInvoice={true}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
