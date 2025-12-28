"use client"

import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { usePermissions } from "@/lib/permissions-context"
import { useBreadcrumb } from "@/lib/breadcrumb-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Bell,
  Building2,
  CreditCard,
  Globe,
  Lock,
  Mail,
  Package,
  Palette,
  Shield,
  Store,
  Truck,
  User,
  Zap,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const tabs = [
  { id: "general", label: "General", icon: User, roles: ["merchant", "superadmin"] },
  { id: "store", label: "Store", icon: Store, roles: ["merchant"] },
  { id: "notifications", label: "Notifications", icon: Bell, roles: ["merchant", "superadmin"] },
  { id: "payments", label: "Payments", icon: CreditCard, roles: ["merchant"] },
  { id: "shipping", label: "Shipping", icon: Truck, roles: ["merchant"] },
  { id: "platform", label: "Platform", icon: Building2, roles: ["superadmin"] },
  { id: "security", label: "Security", icon: Shield, roles: ["superadmin"] },
]

export default function SettingsPage() {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { toast } = useToast()
  const { setPageInfo } = useBreadcrumb()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const isSuperAdmin = user?.role === "superadmin"
  const isMerchant = user?.role === "merchant"

  const availableTabs = tabs.filter((tab) => tab.roles.includes(user?.role || "merchant"))

  useEffect(() => {
    setPageInfo("Settings", `Manage your ${isSuperAdmin ? "platform" : "store"} settings`)
  }, [setPageInfo, isSuperAdmin])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your {isSuperAdmin ? "platform" : "store"} settings</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="lg:hidden bg-transparent">
              {availableTabs.find((tab) => tab.id === activeTab)?.label || "Select"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {availableTabs.map((tab) => (
              <DropdownMenuItem
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn("flex items-center gap-3 cursor-pointer", activeTab === tab.id && "bg-accent")}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* </CHANGE> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <nav className="space-y-1">
            {availableTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* General Settings - Both roles can see */}
          {activeTab === "general" && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <CardTitle>Profile Settings</CardTitle>
                  </div>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="cet">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    <CardTitle>Password & Security</CardTitle>
                  </div>
                  <CardDescription>Update your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    <CardTitle>Preferences</CardTitle>
                  </div>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger id="date-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Store Settings - Merchant only */}
          {activeTab === "store" && isMerchant && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    <CardTitle>Store Information</CardTitle>
                  </div>
                  <CardDescription>Manage your store details</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" placeholder="My Awesome Store" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Store Description</Label>
                    <Textarea id="store-description" placeholder="Tell customers about your store..." rows={4} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Contact Email</Label>
                      <Input id="store-email" type="email" placeholder="contact@store.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Contact Phone</Label>
                      <Input id="store-phone" type="tel" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-address">Store Address</Label>
                    <Input id="store-address" placeholder="123 Main St, City, State 12345" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <CardTitle>Domain & Branding</CardTitle>
                  </div>
                  <CardDescription>Configure your store's online presence</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input id="domain" placeholder="mystore.com" />
                    <p className="text-sm text-muted-foreground">Connect your custom domain</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo">Store Logo URL</Label>
                    <Input id="logo" placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon">Favicon URL</Label>
                    <Input id="favicon" placeholder="https://..." />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    <CardTitle>Inventory Settings</CardTitle>
                  </div>
                  <CardDescription>Configure inventory management</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Track inventory</Label>
                      <p className="text-sm text-muted-foreground">Monitor stock levels for all products</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low stock alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when stock is running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                    <Input id="low-stock-threshold" type="number" defaultValue="10" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Notifications - Both roles */}
          {activeTab === "notifications" && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <CardTitle>Email Notifications</CardTitle>
                  </div>
                  <CardDescription>Manage which emails you receive</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Order notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new orders</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Product updates</Label>
                      <p className="text-sm text-muted-foreground">Get notified when products are updated</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Low stock alerts</Label>
                      <p className="text-sm text-muted-foreground">Alerts when inventory is running low</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing emails</Label>
                      <p className="text-sm text-muted-foreground">Promotional content and updates</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <CardTitle>Notification Preferences</CardTitle>
                  </div>
                  <CardDescription>Configure how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <Input id="notification-email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-frequency">Notification Frequency</Label>
                    <Select defaultValue="instant">
                      <SelectTrigger id="notification-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Digest</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Payments - Merchant only */}
          {activeTab === "payments" && isMerchant && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <CardTitle>Payment Methods</CardTitle>
                  </div>
                  <CardDescription>Configure accepted payment methods</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Credit Card</Label>
                      <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, Amex</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PayPal</Label>
                      <p className="text-sm text-muted-foreground">Accept PayPal payments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bank Transfer</Label>
                      <p className="text-sm text-muted-foreground">Accept direct bank transfers</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cash on Delivery</Label>
                      <p className="text-sm text-muted-foreground">Allow cash payment on delivery</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <CardTitle>Payment Gateway</CardTitle>
                  </div>
                  <CardDescription>Configure your payment processor</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="gateway">Payment Gateway</Label>
                    <Select defaultValue="stripe">
                      <SelectTrigger id="gateway">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stripe">Stripe</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" placeholder="sk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://yourstore.com/webhooks/stripe" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <CardTitle>Tax Settings</CardTitle>
                  </div>
                  <CardDescription>Configure tax calculation</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic tax calculation</Label>
                      <p className="text-sm text-muted-foreground">Calculate taxes based on customer location</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                    <Input id="tax-rate" type="number" defaultValue="8.5" step="0.1" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Shipping - Merchant only */}
          {activeTab === "shipping" && isMerchant && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    <CardTitle>Shipping Zones</CardTitle>
                  </div>
                  <CardDescription>Define where you ship and rates</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Domestic Shipping</Label>
                    <div className="flex gap-2">
                      <Input placeholder="United States" />
                      <Input type="number" placeholder="Price" className="w-32" />
                      <Button variant="outline">Add</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>International Shipping</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Worldwide" />
                      <Input type="number" placeholder="Price" className="w-32" />
                      <Button variant="outline">Add</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    <CardTitle>Shipping Options</CardTitle>
                  </div>
                  <CardDescription>Configure shipping methods</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Standard Shipping</Label>
                      <p className="text-sm text-muted-foreground">5-7 business days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Express Shipping</Label>
                      <p className="text-sm text-muted-foreground">2-3 business days</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Overnight Shipping</Label>
                      <p className="text-sm text-muted-foreground">Next business day</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Free shipping</Label>
                      <p className="text-sm text-muted-foreground">Free shipping on orders over threshold</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free-shipping-threshold">Free Shipping Threshold</Label>
                    <Input id="free-shipping-threshold" type="number" defaultValue="100" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Platform Settings - Superadmin only */}
          {activeTab === "platform" && isSuperAdmin && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <CardTitle>Platform Configuration</CardTitle>
                  </div>
                  <CardDescription>Manage platform-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="E-Commerce Platform" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-email">Platform Contact Email</Label>
                    <Input id="platform-email" type="email" defaultValue="support@platform.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-url">Support URL</Label>
                    <Input id="support-url" placeholder="https://support.platform.com" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Merchant registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new merchants to register</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Merchant approval required</Label>
                      <p className="text-sm text-muted-foreground">Manually approve new merchants</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    <CardTitle>Features</CardTitle>
                  </div>
                  <CardDescription>Enable or disable platform features</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Analytics</Label>
                      <p className="text-sm text-muted-foreground">Enable analytics for all users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Inventory management</Label>
                      <p className="text-sm text-muted-foreground">Enable inventory tracking</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Multi-currency support</Label>
                      <p className="text-sm text-muted-foreground">Allow multiple currencies</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>API access</Label>
                      <p className="text-sm text-muted-foreground">Enable API for third-party integrations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <CardTitle>Platform Fees</CardTitle>
                  </div>
                  <CardDescription>Configure platform commission and fees</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                    <Input id="commission-rate" type="number" defaultValue="5" step="0.1" />
                    <p className="text-sm text-muted-foreground">Percentage taken from each transaction</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transaction-fee">Transaction Fee</Label>
                    <Input id="transaction-fee" type="number" defaultValue="0.30" step="0.01" />
                    <p className="text-sm text-muted-foreground">Fixed fee per transaction</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* Security Settings - Superadmin only */}
          {activeTab === "security" && isSuperAdmin && (
            <>
              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>Security Policies</CardTitle>
                  </div>
                  <CardDescription>Configure platform security settings</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enforce 2FA for admins</Label>
                      <p className="text-sm text-muted-foreground">Require two-factor authentication</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>IP whitelist</Label>
                      <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select defaultValue="strong">
                      <SelectTrigger id="password-policy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="strong">Strong (8+ chars, numbers, symbols)</SelectItem>
                        <SelectItem value="very-strong">
                          Very Strong (12+ chars, mixed case, numbers, symbols)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b pt-4 pb-3 pl-4 pr-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle>API Security</CardTitle>
                  </div>
                  <CardDescription>Manage API access and security</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rate limiting</Label>
                      <p className="text-sm text-muted-foreground">Limit API requests per user</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (requests/hour)</Label>
                    <Input id="rate-limit" type="number" defaultValue="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-version">Default API Version</Label>
                    <Select defaultValue="v2">
                      <SelectTrigger id="api-version">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">v1 (Legacy)</SelectItem>
                        <SelectItem value="v2">v2 (Current)</SelectItem>
                        <SelectItem value="v3">v3 (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
