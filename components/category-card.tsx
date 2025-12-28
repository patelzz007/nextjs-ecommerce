"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/lib/mock-data"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/?category=${category.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
        <CardContent className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm text-white/90 mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{category.productCount} Products</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
