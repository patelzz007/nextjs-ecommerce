"use client"

import Link from "next/link"
import { StoreHeader } from "@/components/store-header"
import { StoreFooter } from "@/components/store-footer"
import { HeroSection } from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <StoreHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Shop by Category */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900">Shop by Category</h2>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore our carefully curated collections, designed with intention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Women */}
            <Link href="/products?category=women" className="group relative aspect-4/5 overflow-hidden rounded-sm">
              <Image
                src="/elegant-woman-in-minimalist-fashion--burgundy-coat.jpg"
                alt="Women's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-serif mb-2">Women</h3>
                <p className="text-white/80 mb-4">Effortless elegance</p>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-slate-900 transition-transform group-hover:scale-110">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            {/* Men */}
            <Link href="/products?category=men" className="group relative aspect-4/5 overflow-hidden rounded-sm">
              <Image
                src="/handsome-man-in-white-t-shirt--modern-masculine-st.jpg"
                alt="Men's Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-serif mb-2">Men</h3>
                <p className="text-white/80 mb-4">Modern classics</p>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-slate-900 transition-transform group-hover:scale-110">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            {/* Accessories */}
            <Link
              href="/products?category=accessories"
              className="group relative aspect-4/5 overflow-hidden rounded-sm"
            >
              <Image
                src="/luxury-fashion-accessories--gold-jewelry--pearl-ne.jpg"
                alt="Accessories Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-serif mb-2">Accessories</h3>
                <p className="text-white/80 mb-4">Finishing touches</p>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-slate-900 transition-transform group-hover:scale-110">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900">New Arrivals</h2>
              <p className="text-slate-600 leading-relaxed max-w-xl">
                The latest additions to our collection, crafted with care and designed to last.
              </p>
            </div>
            <Button variant="ghost" className="hidden md:inline-flex text-slate-900 hover:text-slate-700" asChild>
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Product 1 */}
            <Link href="/products/1" className="group">
              <div className="relative aspect-3/4 mb-4 overflow-hidden rounded-sm bg-slate-100">
                <Image
                  src="/elegant-orange-bomber-jacket-on-hanger--minimalist.jpg"
                  alt="Oversized Wool Blazer"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-900 text-white">New</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-wider uppercase text-slate-500">Outerwear</p>
                <h3 className="font-medium text-slate-900 group-hover:text-slate-600 transition-colors">
                  Oversized Wool Blazer
                </h3>
                <p className="text-slate-900 font-medium">$245.00</p>
              </div>
            </Link>

            {/* Product 2 */}
            <Link href="/products/2" className="group">
              <div className="relative aspect-3/4 mb-4 overflow-hidden rounded-sm bg-slate-100">
                <Image
                  src="/beige-crew-neck-sweater-with-blue-graphic-print--m.jpg"
                  alt="Cashmere Crew Sweater"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-red-600 text-white">-23%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-wider uppercase text-slate-500">Knitwear</p>
                <h3 className="font-medium text-slate-900 group-hover:text-slate-600 transition-colors">
                  Cashmere Crew Sweater
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-slate-900 font-medium">$189.00</p>
                  <p className="text-slate-400 line-through text-sm">$245.00</p>
                </div>
              </div>
            </Link>

            {/* Product 3 */}
            <Link href="/products/3" className="group">
              <div className="relative aspect-3/4 mb-4 overflow-hidden rounded-sm bg-slate-100">
                <Image
                  src="/blue-checkered-three-piece-suit-on-model--elegant-.jpg"
                  alt="High-Rise Tailored Trousers"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-wider uppercase text-slate-500">Trousers</p>
                <h3 className="font-medium text-slate-900 group-hover:text-slate-600 transition-colors">
                  High-Rise Tailored Trousers
                </h3>
                <p className="text-slate-900 font-medium">$165.00</p>
              </div>
            </Link>

            {/* Product 4 */}
            <Link href="/products/4" className="group">
              <div className="relative aspect-3/4 mb-4 overflow-hidden rounded-sm bg-slate-100">
                <Image
                  src="/white-dress-shirt-with-patterned-tie-on-model--pro.jpg"
                  alt="Silk Button-Down Shirt"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-900 text-white">New</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs tracking-wider uppercase text-slate-500">Tops</p>
                <h3 className="font-medium text-slate-900 group-hover:text-slate-600 transition-colors">
                  Silk Button-Down Shirt
                </h3>
                <p className="text-slate-900 font-medium">$195.00</p>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-4/5 rounded-sm overflow-hidden bg-slate-100">
              <Image
                src="/fashionable-woman-in-white-top-and-striped-pants--.jpg"
                alt="Understated Sophistication"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm tracking-[0.2em] uppercase text-slate-500">The Edit</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-900">
                  Understated <em className="italic">Sophistication</em>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our design philosophy centers on timeless elegance—pieces that transcend seasonal trends and become
                  wardrobe staples. Each garment is thoughtfully crafted with premium materials and meticulous attention
                  to detail.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 bg-slate-900 shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-slate-900">Sustainable Materials</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Responsibly sourced fabrics with minimal environmental impact.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1 bg-slate-900 shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-slate-900">Artisan Craftsmanship</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Handcrafted details by skilled artisans around the world.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1 bg-slate-900 shrink-0" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-slate-900">Timeless Design</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Classic silhouettes that remain relevant season after season.
                    </p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white px-8" asChild>
                <Link href="/our-story">
                  Discover Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <StoreFooter />
    </div>
  )
}
