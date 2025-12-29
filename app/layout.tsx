import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { ProductProvider } from "@/lib/products-context";
import { PermissionsProvider } from "@/lib/permissions-context";
import { OrdersProvider } from "@/lib/orders-context";
import { InventoryProvider } from "@/lib/inventory-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "E-Commerce Platform",
   description: "Professional e-commerce platform with admin panel",
   generator: "v0.app",
   icons: {
      icon: [
         { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
         { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
         { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
   },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className="font-sans antialiased">
            <NuqsAdapter>
               <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem={false}
                  disableTransitionOnChange
                  forcedTheme="light"
               >
                  <AuthProvider>
                     <PermissionsProvider>
                        <ProductProvider>
                           <InventoryProvider>
                              <OrdersProvider>
                                 <CartProvider>{children}</CartProvider>
                              </OrdersProvider>
                           </InventoryProvider>
                        </ProductProvider>
                     </PermissionsProvider>
                  </AuthProvider>
               </ThemeProvider>
            </NuqsAdapter>

            <Toaster />
            <Analytics />
         </body>
      </html>
   );
}
