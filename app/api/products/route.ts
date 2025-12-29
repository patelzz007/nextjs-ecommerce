import { NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export async function GET() {
  // Simulate API delay
  await new Promise((res) => setTimeout(res, 700));
  console.log("API /products called, returning products:", NextResponse.json(MOCK_PRODUCTS));
  return NextResponse.json(MOCK_PRODUCTS);
}
