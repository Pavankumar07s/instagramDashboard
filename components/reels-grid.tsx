"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Reel } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Play, Eye, Clock, MapPin, Users } from "lucide-react"

export function ReelsGrid({ username }: { username?: string }) {
  // Always call hooks at the top level
  const key = username ? `/api/reels?username=${encodeURIComponent(username)}` : null
  const { data, error } = useSWR<Reel[]>(key, fetcher)
  
  // Show welcome message when no username is provided
  if (!username) {
    return (
      <section>
        <h2 className="text-lg font-semibold mb-3">Reels</h2>
        <Card className="bg-card text-card-foreground p-8 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎬</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Reels to Display</h3>
              <p className="text-muted-foreground">
                Search for an Instagram username to view their latest reels with video analytics.
              </p>
            </div>
          </div>
        </Card>
      </section>
    )
  }
  
  if (error) return <div className="text-destructive">Failed to load reels for @{username}.</div>
  if (!data) return <GridSkeleton />

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Reels</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((reel) => (
          <Card key={reel.pk} className="bg-card text-card-foreground overflow-hidden rounded-lg">
            {/* Reel Thumbnail with Play Overlay */}
            <div className="relative">
              <img
                src={reel.thumbnailUrl || "/placeholder.svg"}
                alt={`Reel by ${reel.user.username}`}
                className="w-full h-56 object-cover"
                width={420}
                height={420}
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="bg-white/80 rounded-full p-3">
                  <Play className="w-6 h-6 text-black fill-black" />
                </div>
              </div>

              {/* Duration Badge */}
              {reel.videoDuration > 0 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(reel.videoDuration)}s
                </div>
              )}

              {/* Reel Indicator */}
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                Reel
              </div>
            </div>

            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={reel.user.profilePicUrl} alt={reel.user.username} />
                  <AvatarFallback>{reel.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-sm">{reel.user.username}</span>
                    {reel.user.isVerified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Caption */}
              {reel.captionText && (
                <p className="text-sm text-pretty mb-3 line-clamp-3">
                  {reel.captionText}
                </p>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                {reel.viewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{Intl.NumberFormat().format(reel.viewCount)}</span>
                  </div>
                )}
                {reel.playCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span>{Intl.NumberFormat().format(reel.playCount)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{Intl.NumberFormat().format(reel.likeCount)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{Intl.NumberFormat().format(reel.commentCount)}</span>
                </div>
              </div>

              {/* Location */}
              {reel.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{reel.location.name}</span>
                  {reel.location.city && <span>, {reel.location.city}</span>}
                </div>
              )}

              {/* User Tags */}
              {reel.usertags && reel.usertags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {reel.usertags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      @{tag.user.username}
                    </Badge>
                  ))}
                  {reel.usertags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{reel.usertags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Music/Sound Info */}
              {reel.clipsMetadata?.originalSoundInfo && (
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs">
                    🎵 Original Audio
                  </Badge>
                </div>
              )}

              {/* Reel Meta */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {new Date(reel.takenAt).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {reel.productType}
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
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="bg-card p-0 overflow-hidden">
          <div className="h-56 bg-secondary animate-pulse relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-muted rounded-full p-3 animate-pulse">
                <div className="w-6 h-6 bg-muted-foreground/20 rounded" />
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-full animate-pulse" />
              <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
            </div>
            <div className="h-4 w-2/3 bg-secondary rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
              <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
              <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
