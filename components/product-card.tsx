"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
   product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
   const { addToCart } = useCart();
   const { toast } = useToast();
   const [isAdding, setIsAdding] = useState(false);

   const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (product.stock === 0) return;

      setIsAdding(true);
      addToCart(product);

      toast({
         title: "Added to cart",
         description: `${product.name} has been added to your cart.`,
      });

      setTimeout(() => setIsAdding(false), 600);
   };

   const discountPercentage = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

   return (
      <div className="group w-full break-inside-avoid">
         <Link href={`/products/${product.id}`} className="block">
            {/* IMAGE */}
            <div className="relative aspect-3/4 mb-4 overflow-hidden rounded-sm bg-slate-100">
               <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
               />

               {/* Discount & Stock labels */}
               <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discountPercentage > 0 && (
                     <span className="px-3 py-1 text-xs font-medium bg-red-600 text-white">-{discountPercentage}%</span>
                  )}
                  {product.stock > 0 && product.stock < 20 && (
                     <span className="px-3 py-1 text-xs font-medium bg-amber-500 text-white">
                        Only {product.stock} left
                     </span>
                  )}
                  {product.stock === 0 && (
                     <span className="px-3 py-1 text-xs font-medium bg-slate-500 text-white">Out of Stock</span>
                  )}
               </div>

               {/* Add to cart button */}
               <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                     onClick={handleAddToCart}
                     disabled={isAdding || product.stock === 0}
                     className="w-full bg-white text-slate-900 hover:bg-slate-100 h-11 font-medium"
                  >
                     <ShoppingCart className="h-4 w-4 mr-2" />
                     {isAdding ? "Added!" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
               </div>
            </div>

            {/* TEXT */}
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <p className="text-xs tracking-wider uppercase text-slate-500">{product.category}</p>
                  <div className="flex items-center gap-1">
                     <Star className="h-3 w-3 fill-slate-900 text-slate-900" />
                     <span className="text-xs text-slate-600">{product.rating}</span>
                  </div>
               </div>

               <h3 className="font-medium text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-2">
                  {product.name}
               </h3>

               <div className="flex items-center gap-2">
                  <p className="text-slate-900 font-medium">${product.price.toFixed(2)}</p>
                  {product.originalPrice && (
                     <p className="text-slate-400 line-through text-sm">${product.originalPrice.toFixed(2)}</p>
                  )}
               </div>
            </div>
         </Link>
      </div>
   );
}

/**
 * Memoized export
 * Re-renders ONLY if product reference changes
 */
export const ProductCard = memo(ProductCardComponent, (prev, next) => prev.product === next.product);
