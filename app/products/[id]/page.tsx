"use client";

import { useState } from "react";
import { useProduct } from "@/lib/products-context";
import { useCart } from "@/lib/cart-context";
import { StoreLayout } from "@/components/store-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Heart, Share2, Truck, RotateCcw, Shield, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
   const { id } = params;
   const { products } = useProduct();
   const { addToCart } = useCart();
   const { toast } = useToast();

   const product = products.find((p) => p.id === id);
   const [selectedImage, setSelectedImage] = useState(0);
   const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
   const [quantity, setQuantity] = useState(1);

   if (!product) {
      return (
         <StoreLayout showHero={false} showBreadcrumb={false}>
            <div className="container mx-auto px-4 py-16 text-center">
               <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
               <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
               <Button asChild>
                  <Link href="/products">Browse Products</Link>
               </Button>
            </div>
         </StoreLayout>
      );
   }

   const images = product.images || [product.image];
   const reviews = MOCK_REVIEWS.filter((r) => r.productId === product.id);
   const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

   const handleAddToCart = () => {
      console.log("[v0] Add to cart clicked, quantity:", quantity);
      for (let i = 0; i < quantity; i++) {
         addToCart(product);
      }
      console.log("[v0] Showing toast notification");
      toast({
         title: "Added to cart",
         description: `${product.name} (${quantity}x) - $${(product.price * quantity).toFixed(2)}`,
      });
   };

   const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      toast({
         title: "Link copied!",
         description: "Product link copied to clipboard",
      });
   };

   const discountPercentage = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

   return (
      <StoreLayout showHero={false} showBreadcrumb={false}>
         <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
               <Link href="/" className="hover:text-foreground">
                  Home
               </Link>
               <span>/</span>
               <Link href="/products" className="hover:text-foreground">
                  Products
               </Link>
               <span>/</span>
               <Link href={`/products?category=${product.category}`} className="hover:text-foreground">
                  {product.category}
               </Link>
               <span>/</span>
               <span className="text-foreground">{product.name}</span>
            </div>

            <Button variant="ghost" asChild className="mb-4 -ml-4">
               <Link href="/products">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Products
               </Link>
            </Button>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
               {/* Image Gallery */}
               <div>
                  <div className="relative aspect-square overflow-hidden rounded-lg border-2 mb-4">
                     <Image
                        src={images[selectedImage] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                     />
                     {discountPercentage > 0 && (
                        <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                           -{discountPercentage}%
                        </Badge>
                     )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                     {images.map((img, idx) => (
                        <button
                           key={idx}
                           onClick={() => setSelectedImage(idx)}
                           className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === idx ? "border-primary" : "border-border hover:border-muted-foreground"
                           }`}
                        >
                           <Image
                              src={img || "/placeholder.svg"}
                              alt={`${product.name} ${idx + 1}`}
                              fill
                              className="object-cover"
                           />
                        </button>
                     ))}
                  </div>
               </div>

               {/* Product Info */}
               <div>
                  <div className="flex items-start justify-between mb-2">
                     <div>
                        <Badge variant="secondary" className="mb-2">
                           {product.category}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                           <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleShare}>
                           <Share2 className="h-4 w-4" />
                        </Button>
                     </div>
                  </div>

                  <h1 className="text-3xl font-bold mb-3 text-balance">{product.name}</h1>

                  <div className="flex items-center gap-3 mb-4">
                     <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Star
                              key={i}
                              className={`h-5 w-5 ${
                                 i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                              }`}
                           />
                        ))}
                     </div>
                     <span className="font-semibold">{product.rating}</span>
                     <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-4">
                     {product.originalPrice && (
                        <span className="text-2xl text-muted-foreground line-through">
                           ${product.originalPrice.toFixed(2)}
                        </span>
                     )}
                     <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
                     {discountPercentage > 0 && (
                        <Badge variant="destructive" className="text-sm">
                           Save {discountPercentage}%
                        </Badge>
                     )}
                  </div>

                  <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{product.description}</p>

                  <Separator className="my-6" />

                  {/* Variants */}
                  {product.variants && product.variants.length > 0 && (
                     <div className="space-y-4 mb-6">
                        {product.variants.map((variant) => (
                           <div key={variant.id}>
                              <label className="text-sm font-semibold mb-2 block">{variant.name}</label>
                              <div className="flex flex-wrap gap-2">
                                 {variant.options.map((option) => (
                                    <Button
                                       key={option}
                                       variant={selectedVariants[variant.id] === option ? "default" : "outline"}
                                       onClick={() =>
                                          setSelectedVariants({ ...selectedVariants, [variant.id]: option })
                                       }
                                       size="sm"
                                    >
                                       {option}
                                    </Button>
                                 ))}
                              </div>
                           </div>
                        ))}
                     </div>
                  )}

                  {/* Quantity & Stock */}
                  <div className="mb-6">
                     <div className="flex items-center gap-4 mb-3">
                        <label className="text-sm font-semibold">Quantity:</label>
                        <div className="flex items-center border-2 rounded-lg">
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                           >
                              -
                           </Button>
                           <span className="w-12 text-center font-semibold">{quantity}</span>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                              disabled={quantity >= product.stock}
                           >
                              +
                           </Button>
                        </div>
                     </div>
                     <p className="text-sm text-muted-foreground">
                        {product.stock > 20 ? (
                           <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                        ) : product.stock > 0 ? (
                           <span className="text-orange-600 font-medium">Only {product.stock} left!</span>
                        ) : (
                           <span className="text-red-600 font-medium">Out of Stock</span>
                        )}
                     </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-6">
                     <Button onClick={handleAddToCart} disabled={product.stock === 0} size="lg" className="flex-1">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                     </Button>
                     <Button variant="outline" size="lg">
                        Buy Now
                     </Button>
                  </div>

                  {/* SKU */}
                  <p className="text-sm text-muted-foreground mb-6">SKU: {product.sku}</p>

                  <Separator className="my-6" />

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-4">
                     <div className="flex flex-col items-center text-center p-3 border rounded-lg">
                        <Truck className="h-6 w-6 mb-2 text-primary" />
                        <p className="text-xs font-medium">Free Shipping</p>
                     </div>
                     <div className="flex flex-col items-center text-center p-3 border rounded-lg">
                        <RotateCcw className="h-6 w-6 mb-2 text-primary" />
                        <p className="text-xs font-medium">Easy Returns</p>
                     </div>
                     <div className="flex flex-col items-center text-center p-3 border rounded-lg">
                        <Shield className="h-6 w-6 mb-2 text-primary" />
                        <p className="text-xs font-medium">Warranty</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tabs: Details, Reviews, Shipping */}
            <Tabs defaultValue="details" className="mb-12">
               <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details & Specs</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
               </TabsList>

               <TabsContent value="details" className="mt-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Product Specifications</CardTitle>
                     </CardHeader>
                     <CardContent>
                        {product.specifications && (
                           <div className="grid md:grid-cols-2 gap-4">
                              {Object.entries(product.specifications).map(([key, value]) => (
                                 <div key={key} className="flex justify-between border-b pb-2">
                                    <span className="font-medium">{key}:</span>
                                    <span className="text-muted-foreground">{value}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="reviews" className="mt-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Customer Reviews</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        {reviews.length > 0 ? (
                           reviews.map((review) => (
                              <div key={review.id} className="border-b pb-4 last:border-0">
                                 <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                       <span className="font-semibold">{review.userName}</span>
                                       {review.verified && (
                                          <Badge variant="secondary" className="text-xs">
                                             Verified Purchase
                                          </Badge>
                                       )}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                 </div>
                                 <div className="flex items-center gap-1 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                       <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                             i < review.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-200"
                                          }`}
                                       />
                                    ))}
                                 </div>
                                 <p className="text-muted-foreground">{review.comment}</p>
                              </div>
                           ))
                        ) : (
                           <p className="text-center text-muted-foreground py-8">
                              No reviews yet. Be the first to review!
                           </p>
                        )}
                     </CardContent>
                  </Card>
               </TabsContent>

               <TabsContent value="shipping" className="mt-6">
                  <Card>
                     <CardHeader>
                        <CardTitle>Shipping & Returns Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div>
                           <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <Truck className="h-5 w-5 text-primary" />
                              Shipping
                           </h3>
                           <p className="text-muted-foreground">
                              {product.shippingInfo || "Standard shipping available."}
                           </p>
                        </div>
                        <Separator />
                        <div>
                           <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <RotateCcw className="h-5 w-5 text-primary" />
                              Returns
                           </h3>
                           <p className="text-muted-foreground">
                              {product.returnPolicy || "30-day return policy for most items."}
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               </TabsContent>
            </Tabs>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
               <div>
                  <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                  <div className=" grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[420px]">
                     {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                     ))}
                  </div>
               </div>
            )}
         </div>
      </StoreLayout>
   );
}
