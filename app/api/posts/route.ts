import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { Post } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  try {
    // Step 1: Get user profile to extract pk
    const profileOptions = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/by/username',
      params: {
        username: username
      },
      headers: {
        'x-rapidapi-key': 'c4f00fe4dcmsh8d534755e3441b1p19e015jsn2aef2c24c556',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    }

    const profileResponse = await axios.request(profileOptions)
    const userPk = profileResponse.data.pk

    console.log('User PK:', userPk)

    // Step 2: Get user medias using the pk
    const mediasOptions = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/medias',
      params: {
        user_id: userPk.toString(),
        amount: '33'
      },
      headers: {
        'x-rapidapi-key': 'c4f00fe4dcmsh8d534755e3441b1p19e015jsn2aef2c24c556',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    }

    const mediasResponse = await axios.request(mediasOptions)
    const allMedias = mediasResponse.data

    console.log('Total medias received:', allMedias.length)

    // Filter only posts (media_type 1 = image, 8 = carousel)
    const posts = allMedias.filter((media: any) => 
      media.media_type === 1 || media.media_type === 8
    )

    console.log('Posts found:', posts.length)

    // Transform to our Post type with image proxy URLs
    const transformedPosts: Post[] = posts.map((media: any) => {
      // Use image proxy for thumbnail
      const thumbnailUrl = media.thumbnail_url || 
        (media.image_versions?.[0]?.url) || 
        (media.resources?.[0]?.thumbnail_url)
      
      const proxyThumbnailUrl = thumbnailUrl ? 
        `/api/image-proxy?url=${encodeURIComponent(thumbnailUrl)}` : 
        '/placeholder.jpg'

      // Process image versions with proxy
      const imageVersions = media.image_versions?.map((img: any) => ({
        height: img.height,
        width: img.width,
        url: `/api/image-proxy?url=${encodeURIComponent(img.url)}`
      })) || []

      // Process resources (for carousel posts) with proxy
      const resources = media.resources?.map((resource: any) => ({
        pk: resource.pk,
        thumbnailUrl: resource.thumbnail_url ? 
          `/api/image-proxy?url=${encodeURIComponent(resource.thumbnail_url)}` : 
          '/placeholder.jpg',
        mediaType: resource.media_type,
        imageVersions: resource.image_versions?.map((img: any) => ({
          height: img.height,
          width: img.width,
          url: `/api/image-proxy?url=${encodeURIComponent(img.url)}`
        })) || []
      })) || []

      return {
        pk: media.pk,
        id: media.id,
        code: media.code,
        takenAt: media.taken_at,
        takenAtTs: media.taken_at_ts,
        mediaType: media.media_type,
        productType: media.product_type,
        thumbnailUrl: proxyThumbnailUrl,
        captionText: media.caption_text || '',
        likeCount: media.like_count || 0,
        commentCount: media.comment_count || 0,
        hasLiked: media.has_liked || false,
        commentsDisabled: media.comments_disabled || false,
        location: media.location ? {
          pk: media.location.pk,
          name: media.location.name || '',
          city: media.location.city || '',
          lat: media.location.latitude || 0,
          lng: media.location.longitude || 0
        } : undefined,
        user: {
          pk: media.user.pk,
          username: media.user.username,
          fullName: media.user.full_name,
          profilePicUrl: media.user.profile_pic_url ? 
            `/api/image-proxy?url=${encodeURIComponent(media.user.profile_pic_url)}` :
            '/placeholder-user.jpg',
          isVerified: media.user.is_verified || false,
          isPrivate: media.user.is_private || false
        },
        usertags: media.usertags?.map((tag: any) => ({
          user: {
            pk: tag.user.pk,
            username: tag.user.username,
            fullName: tag.user.full_name,
            profilePicUrl: tag.user.profile_pic_url ? 
              `/api/image-proxy?url=${encodeURIComponent(tag.user.profile_pic_url)}` :
              '/placeholder-user.jpg',
            isVerified: tag.user.is_verified || false
          },
          x: tag.x,
          y: tag.y
        })) || [],
        imageVersions,
        resources
      }
    })

    return NextResponse.json(transformedPosts)

  } catch (error) {
    console.error('Error fetching posts:', error)
    
    // Return fallback/mock data in case of error
    const fallbackPosts: Post[] = [
      {
        pk: "fallback-1",
        id: "fallback-1",
        code: "fallback1",
        takenAt: new Date().toISOString(),
        takenAtTs: Date.now() / 1000,
        mediaType: 1,
        productType: "feed",
        thumbnailUrl: "/placeholder.jpg",
        captionText: "Sample post content",
        likeCount: 150,
        commentCount: 25,
        hasLiked: false,
        commentsDisabled: false,
        user: {
          pk: "sample-pk",
          username: username || "sample_user",
          fullName: "Sample User",
          profilePicUrl: "/placeholder-user.jpg",
          isVerified: false,
          isPrivate: false
        },
        usertags: [],
        imageVersions: [{
          height: 1080,
          width: 1080,
          url: "/placeholder.jpg"
        }]
      }
    ]

    return NextResponse.json(fallbackPosts)
  }
}
