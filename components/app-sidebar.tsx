"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  UserCog,
  Package,
  DollarSign,
  UserPlus,
  Phone,
  Dumbbell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Enquiries",
    href: "/enquiries",
    icon: UserPlus,
  },
  {
    title: "Follow Ups",
    href: "/follow-ups",
    icon: Phone,
  },
  {
    title: "Reports",
    items: [
      {
        title: "Balance Due Report",
        href: "/reports/balance-due",
        icon: DollarSign,
      },
      {
        title: "Sales Report",
        href: "/reports/sales",
        icon: FileText,
      },
    ],
  },
  {
    title: "Member Management",
    items: [
      {
        title: "Members",
        href: "/members",
        icon: Users,
      },
      {
        title: "Memberships",
        href: "/memberships",
        icon: Package,
      },
    ],
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Teams",
    items: [
      {
        title: "Employees",
        href: "/teams/employees",
        icon: UserCog,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-2 border-r bg-card">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-3 font-semibold">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-md">
            <Dumbbell className="h-5 w-5 text-gray-900" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight leading-tight">
              The Master<span className="text-yellow-600">'s</span>
            </span>
            <span className="text-xs font-medium text-muted-foreground -mt-0.5">GYM</span>
          </div>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-2 py-2">
          {navigation.map((section, index) => (
            <div key={index}>
              {section.href ? (
                <Link href={section.href}>
                  <Button
                    variant={pathname === section.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === section.href &&
                        "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-600 hover:to-yellow-700",
                    )}
                  >
                    {section.icon && <section.icon className="mr-2 h-4 w-4" />}
                    {section.title}
                  </Button>
                </Link>
              ) : (
                <div>
                  <div className="mb-2 px-3 py-2 text-sm font-semibold text-muted-foreground">{section.title}</div>
                  <div className="space-y-1">
                    {section.items?.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant={pathname === item.href ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            pathname === item.href &&
                              "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-600 hover:to-yellow-700",
                          )}
                        >
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          {item.title}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {index < navigation.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
