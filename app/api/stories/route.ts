import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import type { Story } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const options = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/stories/by/username',
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

    console.log("Stories API Response:", {
      success: Array.isArray(data),
      count: data?.length || 0,
      username: username
    })

    if (Array.isArray(data)) {
      // Transform API response to our Story type
      const transformedStories: Story[] = data.map((story: any) => ({
        id: story.id,
        pk: story.pk,
        code: story.code,
        takenAt: story.taken_at,
        mediaType: story.media_type,
        thumbnailUrl: story.thumbnail_url 
          ? `/api/image-proxy?url=${encodeURIComponent(story.thumbnail_url)}`
          : "",
        videoUrl: story.video_url 
          ? `/api/image-proxy?url=${encodeURIComponent(story.video_url)}`
          : undefined,
        videoDuration: story.video_duration || 0,
        user: {
          pk: story.user.pk,
          username: story.user.username,
          fullName: story.user.full_name,
          profilePicUrl: story.user.profile_pic_url 
            ? `/api/image-proxy?url=${encodeURIComponent(story.user.profile_pic_url)}`
            : "",
          isVerified: story.user.is_verified || false
        }
      }))

      return NextResponse.json(transformedStories)
    } else {
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Stories API Error:", error)
    return NextResponse.json([])
  }
}
