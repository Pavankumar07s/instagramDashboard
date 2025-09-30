import { NextResponse } from "next/server"
import { profile, getProfileFor } from "@/lib/mock-data"
import axios from "axios"
import type { Profile } from "@/lib/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") || ""
  
  if (username) {
    try {
      // Fetch from Instagram API
      const options = {
        method: 'GET',
        url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/web_profile_info',
        params: {
          username: username
        },
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
        }
      }

      const response = await axios.request(options)
      const data = response.data

      console.log("Instagram API Response:", {
        success: !!data?.user,
        username: data?.user?.username,
        profilePicUrl: data?.user?.profile_pic_url,
        profilePicUrlHd: data?.user?.profile_pic_url_hd,
        fullName: data?.user?.full_name,
        followers: data?.user?.edge_followed_by?.count,
      })

      if (data?.user) {
        const user = data.user
        
        // Transform API response to our Profile type
        const transformedProfile: Profile = {
          id: user.id || username,
          name: user.full_name || username,
          username: user.username || username,
          profilePic: user.profile_pic_url_hd 
            ? `/api/image-proxy?url=${encodeURIComponent(user.profile_pic_url_hd)}`
            : user.profile_pic_url 
            ? `/api/image-proxy?url=${encodeURIComponent(user.profile_pic_url)}`
            : "/placeholder.svg",
          followers: user.edge_followed_by?.count || 0,
          following: user.edge_follow?.count || 0,
          postsCount: user.edge_owner_to_timeline_media?.count || 0,
          biography: user.biography || "",
          bioLinks: user.bio_links || [],
          categoryName: user.category_name || "",
          isVerified: user.is_verified || false,
          isPrivate: user.is_private || false
        }

        return NextResponse.json(transformedProfile)
      } else {
        // Fallback to mock data if API doesn't return user data
        const p = getProfileFor(username)
        return NextResponse.json(p)
      }
    } catch (error) {
      console.error("Instagram API Error:", error)
      // Fallback to mock data on API error
      const p = getProfileFor(username)
      return NextResponse.json(p)
    }
  }
  
  return NextResponse.json(profile)
}
