"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Story } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, Clock, Volume2, VolumeX, Maximize, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export function StoriesHighlights({ username }: { username?: string }) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  
  const key = username ? `/api/stories?username=${encodeURIComponent(username)}` : null
  const { data: stories, error, isLoading } = useSWR<Story[]>(key, fetcher)

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story)
    if (story.mediaType === 2 && story.videoUrl) {
      setIsVideoModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsVideoModalOpen(false)
    setSelectedStory(null)
  }

  if (!username) return null
  if (error) return <div className="text-destructive text-sm">Failed to load stories.</div>
  if (isLoading) return <StoriesSkeleton />
  if (!stories || stories.length === 0) return null

  return (
    <>
      <Card className="bg-card text-card-foreground p-6 rounded-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Stories</h3>
            <Badge variant="secondary" className="text-xs">
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </Badge>
          </div>
          
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-2">
              {stories.map((story) => (
                <StoryItem
                  key={story.id}
                  story={story}
                  onClick={() => handleStoryClick(story)}
                  isSelected={selectedStory?.id === story.id}
                />
              ))}
            </div>
          </ScrollArea>

          {selectedStory && !isVideoModalOpen && (
            <StoryPreview 
              story={selectedStory} 
              onClose={() => setSelectedStory(null)}
              onPlayVideo={() => setIsVideoModalOpen(true)}
            />
          )}
        </div>
      </Card>

      {/* Video Modal */}
      <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selectedStory && (
            <VideoPlayer 
              story={selectedStory} 
              onClose={closeModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function StoryItem({ 
  story, 
  onClick, 
  isSelected 
}: { 
  story: Story
  onClick: () => void
  isSelected: boolean
}) {
  const isVideo = story.mediaType === 2
  const timeAgo = getTimeAgo(story.takenAt)

  return (
    <div 
      className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
        isSelected ? 'scale-105' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <div className={`relative w-16 h-16 rounded-full p-0.5 ${
        isSelected 
          ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500' 
          : 'bg-gradient-to-tr from-purple-500/50 via-pink-500/50 to-orange-500/50'
      }`}>
        <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
          <img
            src={story.thumbnailUrl || "/placeholder.svg"}
            alt={`Story by ${story.user.username}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
        
        {isVideo && (
          <div className="absolute bottom-0 right-0 bg-black/70 text-white rounded-full p-1">
            <Play className="w-2 h-2 fill-current" />
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
        {timeAgo}
      </div>
    </div>
  )
}

function StoryPreview({ 
  story, 
  onClose,
  onPlayVideo 
}: { 
  story: Story
  onClose: () => void
  onPlayVideo?: () => void
}) {
  const isVideo = story.mediaType === 2
  const timeAgo = getTimeAgo(story.takenAt)

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Story Preview</h4>
          {isVideo && (
            <Badge variant="outline" className="text-xs">
              <Play className="w-3 h-3 mr-1" />
              Video
            </Badge>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          ✕
        </button>
      </div>
      
      <div className="relative rounded-lg overflow-hidden bg-black/5 aspect-[9/16] max-h-96">
        {isVideo ? (
          <div className="relative w-full h-full">
            <img
              src={story.thumbnailUrl || "/placeholder.svg"}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
              onClick={onPlayVideo}
            >
              <div className="bg-black/50 text-white rounded-full p-4 hover:bg-black/70 transition-colors">
                <Play className="w-8 h-8 fill-current" />
              </div>
            </div>
            {story.videoDuration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white rounded px-2 py-1 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {Math.round(story.videoDuration)}s
              </div>
            )}
          </div>
        ) : (
          <img
            src={story.thumbnailUrl || "/placeholder.svg"}
            alt="Story image"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="mt-3 text-sm text-muted-foreground">
        Posted {timeAgo}
      </div>
    </div>
  )
}

function VideoPlayer({ 
  story, 
  onClose 
}: { 
  story: Story
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const timeAgo = getTimeAgo(story.takenAt)

  return (
    <div className="relative bg-black aspect-[9/16] max-h-[80vh]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <img
              src={story.user.profilePicUrl || "/placeholder.svg"}
              alt={story.user.username}
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{story.user.username}</span>
                {story.user.isVerified && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-[8px]">✓</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-white/70">{timeAgo}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        src={story.videoUrl}
        className="w-full h-full object-cover"
        muted={isMuted}
        playsInline
        onClick={togglePlay}
      >
        Your browser does not support the video tag.
      </video>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex items-center gap-3 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isPlaying ? (
              <div className="w-3 h-3 bg-white"></div>
            ) : (
              <Play className="w-3 h-3 fill-current" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            {isMuted ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </Button>

          <div className="flex-1 text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Progress bar */}
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center play button when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 h-16 w-16 rounded-full p-0"
          >
            <Play className="w-8 h-8 fill-current" />
          </Button>
        </div>
      )}
    </div>
  )
}

function StoriesSkeleton() {
  return (
    <Card className="bg-card text-card-foreground p-6 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-secondary rounded" />
          <div className="h-5 w-16 bg-secondary rounded" />
        </div>
        
        <div className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <div className="w-16 h-16 bg-secondary rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}
