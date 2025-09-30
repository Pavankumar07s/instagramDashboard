import { NextResponse } from "next/server"
import { posts, getPostsFor } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") || ""
  if (username) {
    const data = getPostsFor(username)
    return NextResponse.json(data)
  }
  return NextResponse.json(posts)
}
