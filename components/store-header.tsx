"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X, Store, UserCircle2, Package, Search } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function StoreHeader() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-semibold tracking-tight text-gray-900">MAISON</span>
            </Link>

            {/* Center Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/new-arrivals"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                New Arrivals
              </Link>
              <Link href="/women" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Women
              </Link>
              <Link href="/men" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Men
              </Link>
              <Link
                href="/accessories"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Accessories
              </Link>
              <Link href="/sale" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Sale
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Icon - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-10 w-10 text-gray-700 hover:text-gray-900"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex h-10 w-10 text-gray-700 hover:text-gray-900"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="cursor-pointer">
                          <UserCircle2 className="mr-2 h-4 w-4" />
                          <span>My Account</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      {(user.role === "superadmin" || user.role === "merchant") && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Sign In</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="cursor-pointer">
                          <UserCircle2 className="mr-2 h-4 w-4" />
                          <span>Create Account</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart Icon with Badge */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-10 w-10 text-gray-700 hover:text-gray-900"
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center px-1.5">
                      {cartCount}
                    </Badge>
                  )}
                  <span className="sr-only">Cart</span>
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 text-gray-700 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-white/1 backdrop-blur-md z-[60] lg:hidden"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.01)" }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Menu Drawer */}
          <div className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[70] lg:hidden animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <span className="text-xl font-semibold text-gray-900">MAISON</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 w-10 text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col px-6 py-8 gap-6 flex-1">
                <Link
                  href="/new-arrivals"
                  className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link
                  href="/women"
                  className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Women
                </Link>
                <Link
                  href="/men"
                  className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Men
                </Link>
                <Link
                  href="/accessories"
                  className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accessories
                </Link>
                <Link
                  href="/sale"
                  className="text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sale
                </Link>

                <div className="border-t pt-6 mt-4">
                  <Link
                    href={user ? "/account" : "/login"}
                    className="flex items-center gap-3 text-base font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {user ? "My Account" : "Sign In"}
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] md:hidden transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-[320px] bg-background shadow-2xl z-[70] md:hidden animate-in slide-in-from-right duration-300 border-l">
            <div className="flex flex-col h-full">
              <div className="px-6 py-5 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Menu</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Navigation
                  </p>
                  <nav className="space-y-1">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Store className="h-4 w-4" />
                      Shop
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center justify-between px-3 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </div>
                      {cartCount > 0 && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5">
                          {cartCount}
                        </Badge>
                      )}
                    </Link>
                  </nav>
                </div>

                <Separator />

                <div className="p-4 flex-1">
                  {user ? (
                    <>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                        Account
                      </p>

                      <div className="px-4 py-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl mb-3 border">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12 border-2 border-background">
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs capitalize font-medium">
                          {user.role}
                        </Badge>
                      </div>

                      <nav className="space-y-1">
                        <Link
                          href="/account"
                          className="flex items-center gap-3 px-3 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                          onClick={() => setDrawerOpen(false)}
                        >
                          <UserCircle2 className="h-4 w-4" />
                          My Account
                        </Link>

                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-3 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                          onClick={() => setDrawerOpen(false)}
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>

                        {(user.role === "superadmin" || user.role === "merchant") && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors"
                            onClick={() => setDrawerOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                      </nav>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">
                        Account
                      </p>
                      <div className="px-3">
                        <Button asChild className="w-full" size="lg">
                          <Link href="/login" onClick={() => setDrawerOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {user && (
                  <>
                    <Separator />
                    <div className="p-4">
                      <button
                        onClick={() => {
                          logout()
                          setDrawerOpen(false)
                        }}
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium hover:bg-destructive/10 text-destructive rounded-lg transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
