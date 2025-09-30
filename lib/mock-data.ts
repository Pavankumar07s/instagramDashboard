import type { Analytics, Post, Profile, Reel } from "./types"

const sampleCaptions = [
  "Sunset vibes at the beach",
  "Cozy coffee morning",
  "Luxury staycation weekend",
  "Street style fit check",
  "Outdoor hike with friends",
  "Aesthetic brunch in town",
  "Travel diary: Rome edition",
  "Party night with the crew",
  "Minimal desk setup goals",
  "Energetic workout session",
]

const keywordsMap: Record<string, string[]> = {
  beach: ["travel", "outdoor"],
  coffee: ["food", "cozy"],
  luxury: ["luxury", "lifestyle"],
  street: ["fashion", "streetwear"],
  hike: ["outdoor", "fitness"],
  brunch: ["food", "aesthetic"],
  travel: ["travel", "culture"],
  party: ["nightlife", "party"],
  desk: ["aesthetic", "minimal"],
  workout: ["fitness", "energetic"],
}

function analyzeCaption(caption: string) {
  const c = caption.toLowerCase()
  let tags: string[] = []
  if (c.includes("beach")) tags = tags.concat(keywordsMap.beach)
  if (c.includes("coffee")) tags = tags.concat(keywordsMap.coffee)
  if (c.includes("luxury")) tags = tags.concat(keywordsMap.luxury)
  if (c.includes("street")) tags = tags.concat(keywordsMap.street)
  if (c.includes("hike")) tags = tags.concat(keywordsMap.hike)
  if (c.includes("brunch")) tags = tags.concat(keywordsMap.brunch)
  if (c.includes("travel") || c.includes("rome")) tags = tags.concat(keywordsMap.travel)
  if (c.includes("party")) tags = tags.concat(keywordsMap.party)
  if (c.includes("desk")) tags = tags.concat(keywordsMap.desk)
  if (c.includes("workout")) tags = tags.concat(keywordsMap.workout)

  // assign vibe
  let vibe: Post["vibe"] = "casual"
  if (tags.includes("luxury")) vibe = "luxury"
  else if (tags.includes("aesthetic")) vibe = "aesthetic"
  else if (tags.includes("energetic") || tags.includes("fitness")) vibe = "energetic"

  // naive quality: more tags => higher
  const quality: Post["quality"] = tags.length >= 3 ? "high" : tags.length === 2 ? "medium" : "low"

  // dedupe
  tags = Array.from(new Set(tags))
  return { tags, vibe, quality }
}

function reelVibeFromTags(tags: string[]): Reel["vibe"] {
  if (tags.includes("nightlife") || tags.includes("party")) return "nightlife"
  if (tags.includes("luxury")) return "lavish"
  return "casual"
}

// simple deterministic pseudo-random based on username
function seedFrom(str: string) {
  let s = 0
  for (let i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0
  return s || 1
}
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    // xorshift
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967295
  }
}

export function getProfileFor(rawUsername: string): Profile {
  const uname = rawUsername.startsWith("@") ? rawUsername : "@" + rawUsername
  const nameGuess = uname
    .replace("@", "")
    .split(/[._-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
  const id = `profile_${uname.replace("@", "")}`
  // use placeholder if no avatar set for that user
  return {
    id,
    name: nameGuess || "Unknown User",
    username: uname,
    profilePic: "/diverse-user-avatars.png",
    followers: 10_000 + Math.floor(seedFrom(uname) % 500_000),
    following: 100 + Math.floor(seedFrom(uname) % 1000),
    postsCount: 50 + Math.floor(seedFrom(uname) % 800),
  }
}

export function getPostsFor(rawUsername: string): Post[] {
  const p = getProfileFor(rawUsername)
  const random = rng(seedFrom(p.id))
  return Array.from({ length: 10 }).map((_, i) => {
    const captions = [
      "Sunset vibes at the beach",
      "Cozy coffee morning",
      "Luxury staycation weekend",
      "Street style fit check",
      "Outdoor hike with friends",
      "Aesthetic brunch in town",
      "Travel diary: Rome edition",
      "Party night with the crew",
      "Minimal desk setup goals",
      "Energetic workout session",
    ]
    const caption = captions[i % captions.length]
    const { tags, vibe, quality } = analyzeCaption(caption)
    const likes = Math.floor(1500 + random() * 20000)
    const comments = Math.floor(30 + random() * 800)
    return {
      id: `${p.id}_post_${i + 1}`,
      profileId: p.id,
      imageUrl: `/placeholder.svg?height=420&width=420&query=${encodeURIComponent(caption)}`,
      caption,
      likes,
      comments,
      tags,
      vibe,
      quality,
    }
  })
}

export function getReelsFor(rawUsername: string): Reel[] {
  const p = getProfileFor(rawUsername)
  const random = rng(seedFrom(p.id) ^ 0x9e3779b9)
  return Array.from({ length: 5 }).map((_, i) => {
    const base = ["Dance floor party", "City night drive", "Luxury unboxing", "Beach day reel", "Workout challenge"][
      i % 5
    ]
    const { tags } = analyzeCaption(base)
    const likes = Math.floor(3000 + random() * 30000)
    const comments = Math.floor(50 + random() * 900)
    const views = Math.floor(likes * (8 + random() * 18))
    return {
      id: `${p.id}_reel_${i + 1}`,
      profileId: p.id,
      thumbnailUrl: `/placeholder.svg?height=420&width=420&query=${encodeURIComponent(base + " reel")}`,
      caption: base,
      views,
      likes,
      comments,
      tags,
      vibe: reelVibeFromTags(tags),
    }
  })
}

export function getAnalyticsFor(rawUsername: string): Analytics {
  const p = getProfileFor(rawUsername)
  const userPosts = getPostsFor(rawUsername)
  const avgLikes = Math.round(userPosts.reduce((a, x) => a + x.likes, 0) / userPosts.length)
  const avgComments = Math.round(userPosts.reduce((a, x) => a + x.comments, 0) / userPosts.length)
  const engagementRate = Number((((avgLikes + avgComments) / p.followers) * 100).toFixed(2))
  const trend = userPosts.map((x, idx) => ({ index: idx + 1, likes: x.likes, comments: x.comments }))
  const demographics = {
    gender: { male: 40, female: 58, other: 2 },
    age: [
      { range: "13-17", percent: 5 },
      { range: "18-24", percent: 30 },
      { range: "25-34", percent: 37 },
      { range: "35-44", percent: 18 },
      { range: "45+", percent: 10 },
    ],
    geography: [
      { country: "US", percent: 32 },
      { country: "UK", percent: 12 },
      { country: "IN", percent: 18 },
      { country: "BR", percent: 8 },
      { country: "DE", percent: 7 },
      { country: "Other", percent: 23 },
    ],
  }
  return { avgLikes, avgComments, engagementRate, trend, demographics }
}

export const profile: Profile = getProfileFor("@avasummers")

export const posts: Post[] = getPostsFor("@avasummers")

export const reels: Reel[] = getReelsFor("@avasummers")

export const analytics: Analytics = getAnalyticsFor("@avasummers")
