"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { X } from "lucide-react";

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
      <div className="space-y-6">
         {/* Categories */}
         <div>
            <Label className="text-sm font-medium mb-3 block uppercase tracking-wider">Categories</Label>
            <div className="space-y-3">
               {categories.map((c) => (
                  <div key={c} className="flex items-center space-x-3">
                     <Checkbox checked={selectedCategories.includes(c)} onCheckedChange={() => onToggleCategory(c)} />
                     <span className="text-sm">{c}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Brands */}
         <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-3 block uppercase tracking-wider">Brands</Label>
            <div className="space-y-3">
               {brands.map((b) => (
                  <div key={b} className="flex items-center space-x-3">
                     <Checkbox checked={selectedBrands.includes(b)} onCheckedChange={() => onToggleBrand(b)} />
                     <span className="text-sm">{b}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Price */}
         <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-3 block uppercase tracking-wider pb-4">Price Range</Label>
            <DualRangeSlider
               value={tempPriceRange}
               onValueChange={(v) => onTempPriceChange(v as [number, number])}
               onValueCommit={(v) => onPriceCommit(v as [number, number])}
               min={0}
               max={maxPrice}
               step={1}
               label={(v) => <span className="text-xs">${v}</span>}
               className="mt-6"
            />
         </div>

         {/* Rating */}
         <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-3 block uppercase tracking-wider">Minimum Rating</Label>
            <Select value={minRating.toString()} onValueChange={(v) => onRatingChange(Number(v))}>
               <SelectTrigger>
                  <SelectValue />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="0">All</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
               </SelectContent>
            </Select>
         </div>

         {/* Stock */}
         <div className="pt-4 border-t flex items-center space-x-3">
            <Checkbox checked={inStock} onCheckedChange={(v) => onStockChange(Boolean(v))} />
            <span className="text-sm">In Stock Only</span>
         </div>

         {activeFiltersCount > 0 && (
            <Button variant="outline" className="w-full" onClick={onClear}>
               <X className="w-4 h-4 mr-2" />
               Clear Filters
            </Button>
         )}
      </div>
   );
});
