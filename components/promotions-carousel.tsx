"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { PromotionBanner } from "@/components/promotion-banner"
import type { Promotion } from "@/lib/mock-data"
import Autoplay from "embla-carousel-autoplay"
import { useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

interface PromotionsCarouselProps {
  promotions: Promotion[]
  autoplay?: boolean
  autoplayDelay?: number
}

export function PromotionsCarousel({ promotions, autoplay = true, autoplayDelay = 5000 }: PromotionsCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [scrollSnapCount, setScrollSnapCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    const updateScrollSnaps = () => {
      setCurrent(api.selectedScrollSnap())
      setScrollSnapCount(api.scrollSnapList().length)
    }

    updateScrollSnaps()

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })

    api.on("reInit", updateScrollSnaps)

    return () => {
      api.off("select", () => {})
      api.off("reInit", updateScrollSnaps)
    }
  }, [api])

  const autoplayPlugin = autoplay
    ? Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: true,
      })
    : undefined

  const showDots = scrollSnapCount > 1

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={autoplayPlugin ? [autoplayPlugin] : undefined}
        className="w-full"
      >
        <CarouselContent>
          {promotions.map((promotion) => (
            <CarouselItem key={promotion.id} className="md:basis-1/2 lg:basis-1/2">
              <div className="p-1">
                <PromotionBanner promotion={promotion} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {showDots && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: scrollSnapCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === current ? "w-8 bg-black" : "w-2.5 bg-black/30 hover:bg-black/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
