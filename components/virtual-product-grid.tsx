"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useRef } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/mock-data";

export function VirtualProductGrid({ products }: { products: Product[] }) {
   const parentRef = useRef<HTMLDivElement>(null);

   const rowVirtualizer = useVirtualizer({
      count: products.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 420,
      overscan: 6,
   });

   return (
      <div ref={parentRef} className="h-[calc(100vh-280px)] overflow-auto">
         <div
            style={{
               height: rowVirtualizer.getTotalSize(),
               position: "relative",
            }}
         >
            {rowVirtualizer.getVirtualItems().map((row) => {
               const product = products[row.index];
               return (
                  // <div
                  //    key={product.id}
                  //    style={{
                  //       position: "absolute",
                  //       top: 0,
                  //       transform: `translateY(${row.start}px)`,
                  //       width: "100%",
                  //    }}
                  //    className="px-1 pb-10"
                  // >
                  //    <ProductCard product={product} />
                  // </div>
                  <div className=" grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[420px]">
                     {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                     ))}
                  </div>
               );
            })}
         </div>
      </div>
   );
}
