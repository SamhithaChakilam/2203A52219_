import { type NextRequest, NextResponse } from "next/server"

// Simplified stocks route that always returns demo data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get("symbol")
  const minutes = searchParams.get("minutes")

  console.log(`🎭 Stocks endpoint called for ${symbol} (${minutes} minutes)`)

  if (!symbol || !minutes) {
    return NextResponse.json({ error: "Missing required parameters: symbol and minutes" }, { status: 400 })
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 100))

  // Return demo data structure (will be processed by the client)
  const demoResponse = {
    symbol,
    data: [], // Empty array - client will generate the actual data
    demo_mode: true,
    timestamp: Date.now(),
  }

  return NextResponse.json(demoResponse, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
