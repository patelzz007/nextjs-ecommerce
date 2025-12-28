"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Home, Package, ShoppingCart, Users, Settings, BarChart3 } from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const pages = [
  { name: "Dashboard", icon: Home, href: "/admin" },
  { name: "Products", icon: Package, href: "/admin/products" },
  { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
]

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const handleSelect = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => {
            const Icon = page.icon
            return (
              <CommandItem key={page.href} onSelect={() => handleSelect(page.href)}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{page.name}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
