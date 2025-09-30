export type Profile = {
  id: string
  name: string
  username: string
  profilePic: string
  followers: number
  following: number
  postsCount: number
  biography?: string
  bioLinks?: Array<{
    title: string
    url: string
    link_type: string
  }>
  categoryName?: string
  isVerified?: boolean
  isPrivate?: boolean
}

export type Post = {
  id: string
  profileId: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
  tags: string[]
  vibe: "casual" | "luxury" | "aesthetic" | "energetic"
  quality: "low" | "medium" | "high"
}

export type Reel = {
  id: string
  profileId: string
  thumbnailUrl: string
  caption: string
  views: number
  likes: number
  comments: number
  tags: string[]
  vibe: "casual" | "lavish" | "nightlife"
}

export type Story = {
  id: string
  pk: string
  code: string
  takenAt: string
  mediaType: number // 1 = image, 2 = video
  thumbnailUrl: string
  videoUrl?: string
  videoDuration?: number
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
  }
}

export type Highlight = {
  id: string
  pk: string
  title: string
  createdAt: string
  mediaCount: number
  coverMedia: {
    url: string
    width: number
    height: number
  }
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
  }
  isPinnedHighlight: boolean
}

export type Analytics = {
  avgLikes: number
  avgComments: number
  engagementRate: number // percentage value (e.g., 5.4)
  trend: Array<{ index: number; likes: number; comments: number }>
  demographics?: {
    gender: { male: number; female: number; other: number }
    age: Array<{ range: string; percent: number }>
    geography: Array<{ country: string; percent: number }>
  }
}
