"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AddPTDialogProps {
  memberId: string
  memberName: string
  children?: React.ReactNode
}

export function AddPTDialog({ memberId, memberName, children }: AddPTDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      memberId,
      packageName: formData.get("packageName"),
      duration: formData.get("duration"),
      sessions: formData.get("sessions"),
      price: formData.get("price"),
      startDate: startDate.toISOString(),
    }

    try {
      const response = await fetch("/api/personal-training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Personal training package added successfully",
        })
        setOpen(false)
        router.refresh()
      } else {
        throw new Error("Failed to add PT package")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add personal training. Please try again.",
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
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add PT
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Personal Training</DialogTitle>
          <p className="text-sm text-muted-foreground">For: {memberName}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="packageName">
              Package Name<span className="text-destructive">*</span>
            </Label>
            <Input id="packageName" name="packageName" placeholder="e.g., 3 Month PT" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">
                Duration (Months)<span className="text-destructive">*</span>
              </Label>
              <Input id="duration" name="duration" type="number" placeholder="3" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessions">
                Sessions<span className="text-destructive">*</span>
              </Label>
              <Input id="sessions" name="sessions" type="number" placeholder="36" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              Price (₹)<span className="text-destructive">*</span>
            </Label>
            <Input id="price" name="price" type="number" placeholder="15000" required />
          </div>

          <div className="space-y-2">
            <Label>
              Start Date<span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd-MM-yyyy") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add PT Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
