import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import type { Highlight } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/highlights/by/username',
      params: {
        username: username,
        amount: '0'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    }

    const response = await axios.request(options)
    const data = response.data

    console.log("Highlights API Response:", {
      success: Array.isArray(data),
      count: data?.length || 0,
      username: username
    })

    if (Array.isArray(data)) {
      // Transform API response to our Highlight type
      const transformedHighlights: Highlight[] = data.map((highlight: any) => ({
        id: highlight.id,
        pk: highlight.pk,
        title: highlight.title || "Untitled",
        createdAt: highlight.created_at,
        mediaCount: highlight.media_count || 0,
        coverMedia: {
          url: highlight.cover_media?.cropped_image_version?.url 
            ? `/api/image-proxy?url=${encodeURIComponent(highlight.cover_media.cropped_image_version.url)}`
            : "/placeholder.svg",
          width: highlight.cover_media?.cropped_image_version?.width || 150,
          height: highlight.cover_media?.cropped_image_version?.height || 150
        },
        user: {
          pk: highlight.user.pk,
          username: highlight.user.username,
          fullName: highlight.user.full_name,
          profilePicUrl: highlight.user.profile_pic_url 
            ? `/api/image-proxy?url=${encodeURIComponent(highlight.user.profile_pic_url)}`
            : "",
          isVerified: highlight.user.is_verified || false
        },
        isPinnedHighlight: highlight.is_pinned_highlight || false
      }))

      return NextResponse.json(transformedHighlights)
    } else {
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Highlights API Error:", error)
    return NextResponse.json([])
  }
}
