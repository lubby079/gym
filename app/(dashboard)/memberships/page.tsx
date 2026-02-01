import { getMemberships } from "@/lib/db/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { AddPackageDialog } from "@/components/add-package-dialog"

export const dynamic = "force-dynamic"

export default async function MembershipsPage() {
  const memberships = await getMemberships()

  const totalPackages = memberships.length
  const generalTraining = memberships.filter((m) => m.type === "General Training").length
  const personalTraining = memberships.filter((m) => m.type === "Personal Training").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memberships Package</h1>
          <p className="text-muted-foreground">Manage membership plans and packages</p>
        </div>
        <AddPackageDialog>
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        </AddPackageDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">General Training</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalTraining}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Training</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{personalTraining}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete Fitness</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Memberships Package</CardTitle>
            <div className="relative flex-1 md:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search packages..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Package Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Active Members</TableHead>
                <TableHead>Active / Inactive</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((membership) => (
                <TableRow key={membership._id?.toString()}>
                  <TableCell className="font-medium">{membership._id?.toString().slice(-4)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-orange-500 text-orange-700">
                      {membership.packageName}
                    </Badge>
                  </TableCell>
                  <TableCell>{membership.duration} Months</TableCell>
                  <TableCell>{membership.sessions}</TableCell>
                  <TableCell className="font-semibold">₹{membership.price.toLocaleString()}</TableCell>
                  <TableCell>{membership.memberCount || 0}</TableCell>
                  <TableCell>
                    <Switch checked={membership.isActive} className="data-[state=checked]:bg-green-600" />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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
