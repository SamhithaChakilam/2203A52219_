import { type NextRequest, NextResponse } from "next/server"

// Simplified auth route that always returns demo mode
export async function POST(request: NextRequest) {
  console.log("🎭 Auth endpoint called - returning demo token")

  // Return a demo token response
  const demoAuthResponse = {
    access_token: "demo-token-neural-analytics",
    token_type: "Bearer",
    expires_in: 3600,
    scope: "demo",
    demo_mode: true,
  }

  return NextResponse.json(demoAuthResponse, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
