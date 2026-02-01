"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AddPackageDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [durationType, setDurationType] = useState("Months")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      packageName: formData.get("packageName"),
      planType: formData.get("planType"),
      activities: formData.get("activities"),
      planTiming: formData.get("planTiming"),
      description: formData.get("description"),
      duration: formData.get("duration"),
      durationType: formData.get("durationType"),
      sessions: formData.get("sessions"),
      rackRate: formData.get("rackRate"),
      baseRate: formData.get("baseRate"),
      transferDays: formData.get("transferDays"),
      upgradeDays: formData.get("upgradeDays"),
      freezeFrequency: formData.get("freezeFrequency"),
      freezeDuration: formData.get("freezeDuration"),
    }

    try {
      const response = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Package added successfully",
        })
        setOpen(false)
        router.refresh()
      } else {
        throw new Error("Failed to add package")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add package. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Package
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="packageName">
              Plan Name<span className="text-destructive">*</span>
            </Label>
            <Input id="packageName" name="packageName" placeholder="Type Plan Name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planType">
              Plan Type<span className="text-destructive">*</span>
            </Label>
            <Select name="planType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Training">General Training</SelectItem>
                <SelectItem value="Personal Training">Personal Training</SelectItem>
                <SelectItem value="Complete Fitness">Complete Fitness</SelectItem>
                <SelectItem value="Group Ex">Group Ex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activities">
              Activities<span className="text-destructive">*</span>
            </Label>
            <Select name="activities" required>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gym Workout">Gym Workout</SelectItem>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Zumba">Zumba</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="planTiming">
              Plan Timing<span className="text-destructive">*</span>
            </Label>
            <Select name="planTiming" required>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Full Day">Full Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the plan here..."
              className="min-h-[80px]"
            />
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-3 font-semibold">Optional</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transferDays">Transfer Days</Label>
                  <Input id="transferDays" name="transferDays" type="number" placeholder="Enter Transfer Days" />
                  <p className="text-xs text-muted-foreground">Example: 20</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upgradeDays">Upgrade Days</Label>
                  <Input id="upgradeDays" name="upgradeDays" type="number" placeholder="Enter Upgrade Days" />
                  <p className="text-xs text-muted-foreground">Example: 20</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freezeFrequency">Freeze Frequency</Label>
                  <Input
                    id="freezeFrequency"
                    name="freezeFrequency"
                    type="number"
                    placeholder="Enter Freeze Frequency"
                  />
                  <p className="text-xs text-muted-foreground">Example: 20</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="freezeDuration">Freeze Duration</Label>
                  <Input id="freezeDuration" name="freezeDuration" type="number" placeholder="Enter Freeze Duration" />
                  <p className="text-xs text-muted-foreground">Example: 20</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration Type</Label>
            <RadioGroup value={durationType} onValueChange={setDurationType} name="durationType" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Months" id="months" />
                <Label htmlFor="months">Months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Days" id="days" />
                <Label htmlFor="days">Days</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration<span className="text-destructive">*</span>
              </Label>
              <Input id="duration" name="duration" type="number" placeholder="Enter Duration" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessions">
                Sessions<span className="text-destructive">*</span>
              </Label>
              <Input id="sessions" name="sessions" type="number" placeholder="Enter Sessions" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rackRate">
                Rack Rate<span className="text-destructive">*</span>
              </Label>
              <Input id="rackRate" name="rackRate" type="number" placeholder="Enter Rack Rate" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseRate">
                Base Rate<span className="text-destructive">*</span>
              </Label>
              <Input id="baseRate" name="baseRate" type="number" placeholder="Enter Base Rate" required />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox id="soldLimit" />
              <Label htmlFor="soldLimit">Sold limit</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Session Days<span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="allDays" />
                <Label htmlFor="allDays">All Days</Label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox id={day} />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
