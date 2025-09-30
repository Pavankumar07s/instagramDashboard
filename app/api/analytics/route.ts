import { NextResponse } from "next/server"
import { analytics, getAnalyticsFor } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") || ""
  if (username) {
    const data = getAnalyticsFor(username)
    return NextResponse.json(data)
  }
  return NextResponse.json(analytics)
}
