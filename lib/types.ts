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
  pk: string
  id: string
  code: string
  takenAt: string
  takenAtTs: number
  mediaType: number // 1 = image, 8 = carousel
  productType: string
  thumbnailUrl: string
  captionText: string
  likeCount: number
  commentCount: number
  hasLiked: boolean
  commentsDisabled: boolean
  location?: {
    pk: number
    name: string
    city: string
    lat: number
    lng: number
  }
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
    isPrivate: boolean
  }
  usertags: Array<{
    user: {
      pk: string
      username: string
      fullName: string
      profilePicUrl: string
      isVerified: boolean
    }
    x: number
    y: number
  }>
  imageVersions: Array<{
    height: number
    width: number
    url: string
  }>
  resources?: Array<{
    pk: string
    thumbnailUrl: string
    mediaType: number
    imageVersions: Array<{
      height: number
      width: number
      url: string
    }>
  }>
}

export type Reel = {
  pk: string
  id: string
  code: string
  takenAt: string
  takenAtTs: number
  mediaType: number // 2 = video/reel
  productType: string
  thumbnailUrl: string
  captionText: string
  likeCount: number
  commentCount: number
  playCount: number
  viewCount: number
  videoDuration: number
  hasLiked: boolean
  commentsDisabled: boolean
  videoUrl: string
  location?: {
    pk: string
    name: string
    city: string
    lat: number
    lng: number
  }
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
    isPrivate: boolean
  }
  usertags: Array<{
    user: {
      pk: string
      username: string
      fullName: string
      profilePicUrl: string
      isVerified: boolean
    }
    x: number
    y: number
  }>
  imageVersions: Array<{
    height: number
    width: number
    url: string
  }>
  videoVersions: Array<{
    bandwidth: number
    height: number
    width: number
    id: string
    type: number
    url: string
  }>
  clipsMetadata?: {
    originalSoundInfo?: any
    musicInfo?: {
      musicAssetInfo?: {
        displayArtist: string
        title: string
        coverArtworkUri: string
      }
    }
    isReel?: boolean
  }
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
