"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { X, Star } from "lucide-react";

interface Props {
   categories: string[];
   brands: string[];
   selectedCategories: string[];
   selectedBrands: string[];
   tempPriceRange: [number, number];
   maxPrice: number;
   minRating: number;
   inStock: boolean;
   activeFiltersCount: number;

   onToggleCategory: (v: string) => void;
   onToggleBrand: (v: string) => void;
   onTempPriceChange: (v: [number, number]) => void;
   onPriceCommit: (v: [number, number]) => void;
   onRatingChange: (v: number) => void;
   onStockChange: (v: boolean) => void;
   onClear: () => void;
}

export const FiltersPanel = React.memo(function FiltersPanel({
   categories,
   brands,
   selectedCategories,
   selectedBrands,
   tempPriceRange,
   maxPrice,
   minRating,
   inStock,
   activeFiltersCount,
   onToggleCategory,
   onToggleBrand,
   onTempPriceChange,
   onPriceCommit,
   onRatingChange,
   onStockChange,
   onClear,
}: Props) {
   return (
      <div className="space-y-8">
         <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-widest text-slate-900">Categories</h3>
            <div className="space-y-4">
               {categories.map((c) => {
                  const isChecked = selectedCategories.some(
                     (sc) => sc.toLowerCase() === c.toLowerCase() // case-insensitive match
                  );

                  return (
                     <label key={c} className="flex items-center space-x-3 cursor-pointer group">
                        <Checkbox
                           checked={isChecked}
                           onCheckedChange={() => onToggleCategory(c)}
                           className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 border-slate-400"
                        />
                        <span className="text-sm text-slate-800 group-hover:text-slate-900 transition-colors font-medium">
                           {c}
                        </span>
                     </label>
                  );
               })}
            </div>
         </div>

         <div className="pt-8 border-t border-slate-300">
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-widest text-slate-900">Brands</h3>
            <div className="space-y-4">
               {brands.map((b) => (
                  <label key={b} className="flex items-center space-x-3 cursor-pointer group">
                     <Checkbox
                        checked={selectedBrands.includes(b)}
                        onCheckedChange={() => onToggleBrand(b)}
                        className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 border-slate-400"
                     />
                     <span className="text-sm text-slate-800 group-hover:text-slate-900 transition-colors font-medium">
                        {b}
                     </span>
                  </label>
               ))}
            </div>
         </div>

         <div className="pt-8 border-t border-slate-300">
            <h3 className="text-xs font-semibold mb-6 uppercase tracking-widest text-slate-900">Price Range</h3>
            <div className="px-1">
               <DualRangeSlider
                  value={tempPriceRange}
                  onValueChange={(v) => onTempPriceChange(v as [number, number])}
                  onValueCommit={(v) => onPriceCommit(v as [number, number])}
                  min={0}
                  max={maxPrice}
                  step={1}
                  className="my-6"
               />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-700 font-medium mt-2">
               <span>${tempPriceRange[0]}</span>
               <span>${tempPriceRange[1]}</span>
            </div>
         </div>

         <div className="pt-8 border-t border-slate-300">
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-widest text-slate-900">Minimum Rating</h3>
            <div className="space-y-3">
               {[0, 3, 4, 4.5].map((rating) => (
                  <label key={rating} className="flex items-center space-x-3 cursor-pointer group">
                     <input
                        type="radio"
                        checked={minRating === rating}
                        onChange={() => onRatingChange(rating)}
                        className="w-4 h-4 text-slate-900 border-slate-400 focus:ring-slate-900"
                     />
                     <div className="flex items-center gap-1">
                        {rating === 0 ? (
                           <span className="text-sm text-slate-800 group-hover:text-slate-900 transition-colors font-medium">
                              All Ratings
                           </span>
                        ) : (
                           <>
                              <span className="text-sm text-slate-800 group-hover:text-slate-900 transition-colors font-medium">
                                 {rating}+
                              </span>
                              <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                           </>
                        )}
                     </div>
                  </label>
               ))}
            </div>
         </div>

         <div className="pt-8 border-t border-slate-300">
            <label className="flex items-center space-x-3 cursor-pointer group">
               <Checkbox
                  checked={inStock}
                  onCheckedChange={(v) => onStockChange(Boolean(v))}
                  className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 border-slate-400"
               />
               <span className="text-sm text-slate-800 group-hover:text-slate-900 transition-colors font-medium">
                  In Stock Only
               </span>
            </label>
         </div>

         {activeFiltersCount > 0 && (
            <div className="pt-6">
               <Button
                  variant="outline"
                  className="w-full border-slate-900 text-white bg-slate-900 hover:bg-slate-800 transition-colors h-12 font-medium"
                  onClick={onClear}
               >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters ({activeFiltersCount})
               </Button>
            </div>
         )}
      </div>
   );
});
