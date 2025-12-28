export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  brand: string
  image: string
  images?: string[]
  category: string
  stock: number
  sku: string
  merchantId: string
  tags: string[]
  featured?: boolean
  popularity: number
  variants?: ProductVariant[]
  specifications?: Record<string, string>
  shippingInfo?: string
  returnPolicy?: string
  status?: "draft" | "published" | "archived"
  productType?: "physical" | "digital"
  weight?: number // in kg for physical products
  dimensions?: {
    length: number
    width: number
    height: number
  }
  isBundle?: boolean
  bundleItems?: string[] // Product IDs that make up the bundle
  lowStockThreshold?: number
  allowBackorders?: boolean
  trackInventory?: boolean
  barcode?: string
  costPrice?: number // For profit margin calculations
  compareAtPrice?: number // Additional comparison price
  taxable?: boolean
  requiresShipping?: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt?: string
  updatedAt?: string
}

export interface Order {
  id: string
  userId: string
  userName: string
  userEmail: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  code: string
  expiresAt: string
  image: string
}

export interface ProductVariant {
  id: string
  name: string
  options: string[]
}

export interface Review {
  id: string
  productId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.5,
    reviewCount: 128,
    brand: "AudioTech",
    image: "/premium-black-wireless-headphones.jpg",
    images: [
      "/premium-black-wireless-headphones.jpg",
      "/premium-black-wireless-headphones.jpg",
      "/premium-black-wireless-headphones.jpg",
    ],
    category: "Electronics",
    stock: 50,
    sku: "AT-WH-001",
    merchantId: "2",
    tags: ["wireless", "noise-cancelling", "bluetooth", "premium"],
    featured: true,
    popularity: 95,
    variants: [
      { id: "color", name: "Color", options: ["Black", "Silver", "Blue"] },
      { id: "size", name: "Size", options: ["Standard", "Large"] },
    ],
    specifications: {
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.0",
      Weight: "250g",
      "Noise Cancellation": "Active",
      Warranty: "2 years",
    },
    shippingInfo: "Free shipping on orders over $50. Estimated delivery 3-5 business days.",
    returnPolicy: "30-day return policy. Items must be in original condition.",
    status: "published",
    productType: "physical",
    weight: 0.25,
    dimensions: { length: 15, width: 10, height: 3 },
    isBundle: false,
    lowStockThreshold: 10,
    allowBackorders: false,
    trackInventory: true,
    barcode: "1234567890123",
    costPrice: 150,
    compareAtPrice: 399.99,
    taxable: true,
    requiresShipping: true,
    metaTitle: "Premium Wireless Headphones",
    metaDescription: "Experience crystal clear sound with noise cancellation.",
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Minimalist Leather Wallet",
    description: "Slim leather wallet with RFID protection and space for 8 cards.",
    price: 59.99,
    rating: 4.8,
    reviewCount: 342,
    brand: "LeatherCraft",
    image: "/black-leather-wallet-minimalist.jpg",
    images: ["/black-leather-wallet-minimalist.jpg", "/black-leather-wallet-minimalist.jpg"],
    category: "Accessories",
    stock: 100,
    sku: "LC-WL-002",
    merchantId: "2",
    tags: ["leather", "rfid", "minimalist", "slim"],
    popularity: 88,
    variants: [{ id: "color", name: "Color", options: ["Black", "Brown", "Tan"] }],
    specifications: {
      Material: "Genuine Leather",
      "Card Slots": "8",
      "RFID Protection": "Yes",
      Dimensions: "10cm x 7cm x 1cm",
    },
    shippingInfo: "Standard shipping $5. Free over $50.",
    returnPolicy: "30-day return policy.",
    status: "published",
    productType: "physical",
    weight: 0.1,
    dimensions: { length: 10, width: 7, height: 1 },
    isBundle: false,
    lowStockThreshold: 20,
    allowBackorders: false,
    trackInventory: true,
    barcode: "0987654321098",
    costPrice: 30,
    compareAtPrice: 79.99,
    taxable: true,
    requiresShipping: true,
    metaTitle: "Minimalist Leather Wallet",
    metaDescription: "Stay organized with this stylish leather wallet.",
    createdAt: "2023-10-02T00:00:00Z",
    updatedAt: "2024-01-18T14:20:00Z",
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with heart rate monitoring, GPS, and water resistance.",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.3,
    reviewCount: 215,
    brand: "FitTrack",
    image: "/black-fitness-smartwatch.jpg",
    images: ["/black-fitness-smartwatch.jpg", "/black-fitness-smartwatch.jpg"],
    category: "Electronics",
    stock: 75,
    sku: "FT-SW-003",
    merchantId: "2",
    tags: ["fitness", "smartwatch", "gps", "waterproof"],
    featured: true,
    popularity: 92,
    variants: [
      { id: "color", name: "Color", options: ["Black", "Red", "Blue"] },
      { id: "size", name: "Size", options: ["Small", "Medium", "Large"] },
    ],
    specifications: {
      Display: "1.4 inch AMOLED",
      "Water Resistance": "5ATM",
      "Battery Life": "7 days",
      GPS: "Built-in",
      Sensors: "Heart Rate, SpO2, Sleep Tracking",
    },
    shippingInfo: "Free shipping. Delivery in 2-4 days.",
    returnPolicy: "30-day return policy for unopened items.",
    status: "published",
    productType: "digital",
    weight: null,
    dimensions: null,
    isBundle: false,
    lowStockThreshold: 5,
    allowBackorders: false,
    trackInventory: false,
    barcode: "5678901234567",
    costPrice: 120,
    compareAtPrice: 299.99,
    taxable: true,
    requiresShipping: false,
    metaTitle: "Smart Fitness Watch",
    metaDescription: "Monitor your health and fitness with this smartwatch.",
    createdAt: "2023-10-03T00:00:00Z",
    updatedAt: "2024-01-20T08:15:00Z",
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable, sustainable t-shirt made from 100% organic cotton.",
    price: 29.99,
    rating: 4.6,
    reviewCount: 456,
    brand: "EcoWear",
    image: "/black-cotton-tshirt.jpg",
    images: ["/black-cotton-tshirt.jpg"],
    category: "Clothing",
    stock: 200,
    sku: "EW-TS-004",
    merchantId: "2",
    tags: ["organic", "cotton", "sustainable", "comfortable"],
    popularity: 78,
    variants: [
      { id: "color", name: "Color", options: ["Black", "White", "Gray", "Navy"] },
      { id: "size", name: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    ],
    specifications: {
      Material: "100% Organic Cotton",
      Fit: "Regular",
      "Care Instructions": "Machine wash cold",
      Certification: "GOTS Certified",
    },
    shippingInfo: "Standard shipping available.",
    returnPolicy: "Free returns within 60 days.",
    status: "published",
    productType: "physical",
    weight: 0.15,
    dimensions: { length: 40, width: 30, height: 20 },
    isBundle: false,
    lowStockThreshold: 30,
    allowBackorders: true,
    trackInventory: true,
    barcode: "4567890123456",
    costPrice: 15,
    compareAtPrice: 49.99,
    taxable: true,
    requiresShipping: true,
    metaTitle: "Organic Cotton T-Shirt",
    metaDescription: "Wear comfortably with this eco-friendly t-shirt.",
    createdAt: "2023-10-04T00:00:00Z",
    updatedAt: "2024-01-21T12:00:00Z",
  },
  {
    id: "5",
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 34.99,
    rating: 4.7,
    reviewCount: 523,
    brand: "HydroLife",
    image: "/black-stainless-water-bottle.jpg",
    images: ["/black-stainless-water-bottle.jpg"],
    category: "Accessories",
    stock: 150,
    sku: "HL-WB-005",
    merchantId: "2",
    tags: ["insulated", "stainless-steel", "eco-friendly", "durable"],
    popularity: 85,
    variants: [
      { id: "color", name: "Color", options: ["Black", "Blue", "Pink", "Green"] },
      { id: "size", name: "Size", options: ["500ml", "750ml", "1L"] },
    ],
    specifications: {
      Material: "Stainless Steel 18/8",
      Insulation: "Double-wall vacuum",
      "Cold Retention": "24 hours",
      "Hot Retention": "12 hours",
      "BPA Free": "Yes",
    },
    shippingInfo: "Ships in 1-2 days.",
    returnPolicy: "Lifetime warranty on defects.",
    status: "published",
    productType: "physical",
    weight: 0.5,
    dimensions: { length: 20, width: 10, height: 5 },
    isBundle: false,
    lowStockThreshold: 25,
    allowBackorders: false,
    trackInventory: true,
    barcode: "7890123456789",
    costPrice: 20,
    compareAtPrice: 59.99,
    taxable: true,
    requiresShipping: true,
    metaTitle: "Stainless Steel Water Bottle",
    metaDescription: "Stay hydrated with this durable water bottle.",
    createdAt: "2023-10-05T00:00:00Z",
    updatedAt: "2024-01-22T16:30:00Z",
  },
  {
    id: "6",
    name: "Professional Camera Lens",
    description: "50mm f/1.8 prime lens for stunning portrait photography.",
    price: 449.99,
    originalPrice: 549.99,
    rating: 4.9,
    reviewCount: 89,
    brand: "OpticsPro",
    image: "/black-camera-lens.jpg",
    images: ["/black-camera-lens.jpg", "/black-camera-lens.jpg"],
    category: "Electronics",
    stock: 30,
    sku: "OP-CL-006",
    merchantId: "2",
    tags: ["camera", "lens", "photography", "professional"],
    featured: true,
    popularity: 90,
    variants: [{ id: "mount", name: "Mount Type", options: ["Canon EF", "Nikon F", "Sony E"] }],
    specifications: {
      "Focal Length": "50mm",
      "Maximum Aperture": "f/1.8",
      "Lens Construction": "6 elements in 5 groups",
      "Minimum Focus Distance": "45cm",
      "Filter Size": "52mm",
    },
    shippingInfo: "Free expedited shipping. Arrives in 1-3 days.",
    returnPolicy: "14-day return policy for unopened items.",
    status: "published",
    productType: "physical",
    weight: 0.3,
    dimensions: { length: 50, width: 30, height: 10 },
    isBundle: false,
    lowStockThreshold: 5,
    allowBackorders: false,
    trackInventory: true,
    barcode: "3210987654321",
    costPrice: 200,
    compareAtPrice: 499.99,
    taxable: true,
    requiresShipping: true,
    metaTitle: "Professional Camera Lens",
    metaDescription: "Capture stunning portraits with this high-quality lens.",
    createdAt: "2023-10-06T00:00:00Z",
    updatedAt: "2024-01-23T09:45:00Z",
  },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-001",
    userId: "3",
    userName: "Regular User",
    userEmail: "user@store.com",
    items: [
      { productId: "1", productName: "Premium Wireless Headphones", quantity: 1, price: 299.99 },
      { productId: "2", productName: "Minimalist Leather Wallet", quantity: 2, price: 59.99 },
    ],
    total: 419.97,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    userId: "3",
    userName: "Regular User",
    userEmail: "user@store.com",
    items: [{ productId: "3", productName: "Smart Fitness Watch", quantity: 1, price: 199.99 }],
    total: 199.99,
    status: "shipped",
    createdAt: "2024-01-18T14:20:00Z",
  },
]

export const FEATURED_PRODUCTS = ["1", "3", "6"] // Product IDs to feature

export const CATEGORIES: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest tech gadgets and accessories",
    image: "/electronics-category.png",
    productCount: 3,
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Style essentials and everyday items",
    image: "/accessories-category.png",
    productCount: 2,
  },
  {
    id: "clothing",
    name: "Clothing",
    description: "Comfortable and sustainable fashion",
    image: "/diverse-clothing-category.png",
    productCount: 1,
  },
]

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    title: "Winter Sale",
    description: "Get 20% off on all electronics",
    discount: 20,
    code: "WINTER20",
    expiresAt: "2024-02-28",
    image: "/winter-sale-banner.jpg",
  },
  {
    id: "promo-2",
    title: "Free Shipping",
    description: "Free shipping on orders over $100",
    discount: 0,
    code: "FREESHIP",
    expiresAt: "2024-12-31",
    image: "/free-shipping-banner.png",
  },
]

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    productId: "1",
    userName: "John D.",
    rating: 5,
    comment: "Best headphones I've ever owned! The noise cancellation is incredible.",
    date: "2024-01-10",
    verified: true,
  },
  {
    id: "rev-2",
    productId: "1",
    userName: "Sarah M.",
    rating: 4,
    comment: "Great sound quality, but a bit heavy for long use.",
    date: "2024-01-08",
    verified: true,
  },
  {
    id: "rev-3",
    productId: "1",
    userName: "Mike R.",
    rating: 5,
    comment: "Perfect for travel and daily commute. Battery life is amazing!",
    date: "2024-01-05",
    verified: false,
  },
]
