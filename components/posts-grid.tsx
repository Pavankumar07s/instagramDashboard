"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Post } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, MapPin, Users } from "lucide-react"

export function PostsGrid({ username }: { username?: string }) {
  // Always call hooks at the top level
  const key = username ? `/api/posts?username=${encodeURIComponent(username)}` : null
  const { data, error } = useSWR<Post[]>(key, fetcher)
  
  // Show welcome message when no username is provided
  if (!username) {
    return (
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
        <Card className="bg-card text-card-foreground p-8 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📸</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Posts to Display</h3>
              <p className="text-muted-foreground">
                Search for an Instagram username to view their latest posts with engagement metrics.
              </p>
            </div>
          </div>
        </Card>
      </section>
    )
  }
  
  if (error) return <div className="text-destructive">Failed to load posts for @{username}.</div>
  if (!data) return <GridSkeleton />

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((post) => (
          <Card key={post.pk} className="bg-card text-card-foreground overflow-hidden rounded-lg">
            {/* Post Image */}
            <div className="relative">
              <img
                src={post.thumbnailUrl || "/placeholder.svg"}
                alt={`Post by ${post.user.username}`}
                className="w-full h-56 object-cover"
                width={420}
                height={420}
              />
              
              {/* Media Type Indicator */}
              {post.mediaType === 8 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  <Users className="w-3 h-3 inline mr-1" />
                  Carousel
                </div>
              )}
            </div>

            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.user.profilePicUrl} alt={post.user.username} />
                  <AvatarFallback>{post.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm">{post.user.username}</span>
                    {post.user.isVerified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Caption */}
              {post.captionText && (
                <p className="text-sm text-pretty mb-3 line-clamp-3">
                  {post.captionText}
                </p>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{Intl.NumberFormat().format(post.likeCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{Intl.NumberFormat().format(post.commentCount)}</span>
                </div>
              </div>

              {/* Location */}
              {post.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{post.location.name}</span>
                  {post.location.city && <span>, {post.location.city}</span>}
                </div>
              )}

              {/* User Tags */}
              {post.usertags && post.usertags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.usertags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      @{tag.user.username}
                    </Badge>
                  ))}
                  {post.usertags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.usertags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Post Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {new Date(post.takenAt).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {post.productType}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function GridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-card p-0 overflow-hidden">
          <div className="h-56 bg-secondary animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
            </div>
            <div className="h-4 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-secondary rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
              <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
