"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Lock,
  MapPin,
  CreditCard,
  Smartphone,
  Trash2,
  Plus,
  Edit,
  X,
  AlertTriangle,
  CheckCircle2,
  Globe,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { StoreLayout } from "@/components/store-layout"

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  last4?: string
  brand?: string
  expiryMonth?: string
  expiryYear?: string
  email?: string
  isDefault: boolean
}

interface Device {
  id: string
  name: string
  type: string
  lastActive: string
  location: string
  isCurrent: boolean
}

export default function AccountPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    company: user?.role === "merchant" ? "My Store Inc." : "",
  })

  // Password state
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      name: "Work",
      street: "456 Market Street, Suite 200",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      country: "United States",
      isDefault: false,
    },
  ])

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2025",
      isDefault: true,
    },
    {
      id: "2",
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiryMonth: "06",
      expiryYear: "2026",
      isDefault: false,
    },
  ])

  // Devices state
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "MacBook Pro",
      type: "Desktop",
      lastActive: "Active now",
      location: "San Francisco, CA",
      isCurrent: true,
    },
    {
      id: "2",
      name: "iPhone 15",
      type: "Mobile",
      lastActive: "2 hours ago",
      location: "San Francisco, CA",
      isCurrent: false,
    },
    {
      id: "3",
      name: "iPad Air",
      type: "Tablet",
      lastActive: "3 days ago",
      location: "Oakland, CA",
      isCurrent: false,
    },
  ])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
    setIsEditing(false)
  }

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    })
    setPasswordData({ current: "", new: "", confirm: "" })
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
    toast({
      title: "Address deleted",
      description: "The address has been removed from your account.",
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id))
    toast({
      title: "Payment method deleted",
      description: "The payment method has been removed from your account.",
    })
  }

  const handleRevokeDevice = (id: string) => {
    setDevices(devices.filter((device) => device.id !== id))
    toast({
      title: "Device revoked",
      description: "The device has been logged out of your account.",
    })
  }

  const handleAccountDeactivation = () => {
    toast({
      title: "Account deactivation requested",
      description: "Your account will be deactivated within 24 hours. You can cancel this request by logging back in.",
    })
    setTimeout(() => {
      logout()
      router.push("/")
    }, 2000)
  }

  const handleAccountDeletion = () => {
    toast({
      title: "Account deletion requested",
      description:
        "Your account and all associated data will be permanently deleted within 30 days as per GDPR requirements.",
    })
    setTimeout(() => {
      logout()
      router.push("/")
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    )
  }

  if (!user) return null

  return (
    <StoreLayout
      showHero={true}
      showBreadcrumb={true}
      heroTitle="Account Settings"
      heroDescription="Manage your profile, security, and preferences"
      heroBadge={{
        icon: Globe,
        text: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      }}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="inline-flex h-11 items-center justify-start w-full bg-muted p-1 rounded-lg overflow-x-auto">
            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-background">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 data-[state=active]:bg-background">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2 data-[state=active]:bg-background">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-background">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2 data-[state=active]:bg-background">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="gap-2 data-[state=active]:bg-background text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Danger Zone</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="h-11"
                    />
                  </div>

                  {user.role === "merchant" && (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                        disabled={!isEditing}
                        className="h-11"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  {isEditing ? (
                    <>
                      <Button onClick={handleProfileUpdate} size="lg">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="lg">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-2">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Password & Security</CardTitle>
                    <CardDescription>Update your password to keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-sm font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button onClick={handlePasswordChange} size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Saved Addresses</h2>
                <p className="text-muted-foreground mt-1">Manage your shipping and billing addresses</p>
              </div>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {addresses.map((address) => (
                <Card key={address.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <CardTitle className="text-lg">{address.name}</CardTitle>
                        </div>
                        {address.isDefault && (
                          <Badge variant="default" className="font-medium">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Default Address
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={address.isDefault}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Address</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this address? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAddress(address.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p className="font-medium text-foreground">{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zip}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Payment Methods</h2>
                <p className="text-muted-foreground mt-1">Manage your saved payment methods</p>
              </div>
              <Button size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            <div className="grid gap-4">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <CreditCard className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-lg">
                            {method.brand} •••• {method.last4}
                          </p>
                          {method.isDefault && (
                            <Badge variant="default" className="font-medium">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="default">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="default" disabled={method.isDefault}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this payment method? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePaymentMethod(method.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices">
            <Card className="border-2">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Manage devices where you're currently logged in</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device, index) => (
                    <div key={device.id}>
                      {index > 0 && <div className="border-t my-4" />}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <Smartphone className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold">{device.name}</p>
                              {device.isCurrent && (
                                <Badge variant="secondary" className="font-medium">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Current Device
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-0.5">
                              <p>
                                {device.type} • {device.lastActive}
                              </p>
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {device.location}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!device.isCurrent && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="default">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Revoke Access
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Device Access</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will log out {device.name} from your account. You'll need to sign in again on
                                  that device.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRevokeDevice(device.id)}>
                                  Revoke Access
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-6">
            <Card className="border-2 border-destructive/50">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Permanent actions that cannot be undone</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border-2 border-orange-200 bg-orange-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Deactivate Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Temporarily disable your account. You can reactivate it by logging back in within 30 days. After
                      30 days, your account will be permanently deleted.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-orange-300 hover:bg-orange-100 bg-transparent">
                          Deactivate Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your account will be temporarily disabled. You can reactivate it by logging in within 30
                            days. After 30 days, your account will be permanently deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleAccountDeactivation}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Deactivate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="p-4 border-2 border-destructive bg-destructive/5 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-destructive">Delete Account Permanently</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone and complies
                      with GDPR requirements.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account Forever
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account Permanently</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Your account and all associated data will be permanently
                            deleted within 30 days in compliance with GDPR. You will receive a confirmation email.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleAccountDeletion}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Yes, Delete Forever
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StoreLayout>
  )
}
