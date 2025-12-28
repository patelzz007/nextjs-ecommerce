import Link from "next/link"
import { Instagram, Twitter, Facebook } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function StoreFooter() {
  return (
    <footer className="bg-slate-50 border-t">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900">Join the Maison</h2>
            <p className="text-slate-600 leading-relaxed">
              Subscribe to receive updates on new arrivals, exclusive offers, and styling inspiration.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="h-12 bg-white border-slate-300" />
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Shop Column */}
          <div>
            <h3 className="font-serif text-lg text-slate-900 mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products?category=new" className="text-slate-600 hover:text-slate-900 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=bestsellers"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Men
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-serif text-lg text-slate-900 mb-4">Help</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/customer-service" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-600 hover:text-slate-900 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="font-serif text-lg text-slate-900 mb-4">About</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/our-story" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="font-serif text-lg text-slate-900 mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600">
            <p>© 2025 Maison. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
