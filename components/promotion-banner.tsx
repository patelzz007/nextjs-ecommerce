"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Tag, Check } from "lucide-react"
import Image from "next/image"
import type { Promotion } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface PromotionBannerProps {
  promotion: Promotion
}

export function PromotionBanner({ promotion }: PromotionBannerProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(promotion.code)
    setCopied(true)
    toast({
      title: "Code copied!",
      description: `Promo code ${promotion.code} copied to clipboard`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-0">
        <div className="relative h-48 md:h-64 w-full overflow-hidden">
          <Image src={promotion.image || "/placeholder.svg"} alt={promotion.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <div className="absolute inset-0 flex flex-col justify-center px-8">
            <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
              <Tag className="h-3 w-3 mr-1" />
              {promotion.discount > 0 ? `${promotion.discount}% OFF` : "SPECIAL OFFER"}
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{promotion.title}</h3>
            <p className="text-white/90 mb-4 text-lg">{promotion.description}</p>
            <div className="flex items-center gap-3">
              <code className="px-4 py-2 bg-white rounded-lg font-mono font-bold text-lg">{promotion.code}</code>
              <Button
                onClick={copyCode}
                variant={copied ? "default" : "secondary"}
                size="sm"
                className="transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
