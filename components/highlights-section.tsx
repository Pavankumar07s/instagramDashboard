"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Highlight } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users } from "lucide-react"
import { useState } from "react"

export function HighlightsSection({ username }: { username?: string }) {
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null)
  
  const key = username ? `/api/highlights?username=${encodeURIComponent(username)}` : null
  const { data: highlights, error, isLoading } = useSWR<Highlight[]>(key, fetcher)

  if (!username) return null
  if (error) return <div className="text-destructive text-sm">Failed to load highlights.</div>
  if (isLoading) return <HighlightsSkeleton />
  if (!highlights || highlights.length === 0) return null

  return (
    <Card className="bg-card text-card-foreground p-6 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Highlights</h3>
          <Badge variant="secondary" className="text-xs">
            {highlights.length} {highlights.length === 1 ? 'highlight' : 'highlights'}
          </Badge>
        </div>
        
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-2">
            {highlights.map((highlight) => (
              <HighlightItem
                key={highlight.id}
                highlight={highlight}
                onClick={() => setSelectedHighlight(highlight)}
                isSelected={selectedHighlight?.id === highlight.id}
              />
            ))}
          </div>
        </ScrollArea>

        {selectedHighlight && (
          <HighlightPreview 
            highlight={selectedHighlight} 
            onClose={() => setSelectedHighlight(null)}
          />
        )}
      </div>
    </Card>
  )
}

function HighlightItem({ 
  highlight, 
  onClick, 
  isSelected 
}: { 
  highlight: Highlight
  onClick: () => void
  isSelected: boolean
}) {
  const createdDate = new Date(highlight.createdAt)
  const monthYear = createdDate.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })

  return (
    <div 
      className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
        isSelected ? 'scale-105' : 'hover:scale-105'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-2 min-w-[80px]">
        {/* Highlight Circle */}
        <div className={`relative w-16 h-16 rounded-full p-0.5 ${
          isSelected 
            ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500' 
            : 'bg-gradient-to-tr from-gray-300 via-gray-400 to-gray-500'
        }`}>
          <div className="w-full h-full rounded-full border-2 border-background overflow-hidden">
            <img
              src={highlight.coverMedia.url || "/placeholder.svg"}
              alt={highlight.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
          </div>
          
          {/* Media count indicator */}
          {highlight.mediaCount > 0 && (
            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {highlight.mediaCount}
            </div>
          )}
        </div>
        
        {/* Title */}
        <div className="text-center">
          <p className="text-xs font-medium truncate max-w-[80px]" title={highlight.title}>
            {highlight.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {monthYear}
          </p>
        </div>
      </div>
    </div>
  )
}

function HighlightPreview({ 
  highlight, 
  onClose 
}: { 
  highlight: Highlight
  onClose: () => void
}) {
  const createdDate = new Date(highlight.createdAt)
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="relative border border-border rounded-lg p-4 bg-secondary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={highlight.coverMedia.url || "/placeholder.svg"}
              alt={highlight.title}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{highlight.title}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{highlight.mediaCount} {highlight.mediaCount === 1 ? 'story' : 'stories'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {highlight.isPinnedHighlight && (
            <Badge variant="outline" className="text-xs">
              Pinned
            </Badge>
          )}
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="relative rounded-lg overflow-hidden bg-black/5 aspect-square max-w-xs mx-auto">
        <img
          src={highlight.coverMedia.url || "/placeholder.svg"}
          alt={highlight.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay with highlight info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
          <div className="p-4 text-white w-full">
            <p className="text-sm font-medium">{highlight.title}</p>
            <p className="text-xs opacity-80">
              {highlight.mediaCount} {highlight.mediaCount === 1 ? 'story' : 'stories'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Click on a highlight to view its stories
        </p>
      </div>
    </div>
  )
}

function HighlightsSkeleton() {
  return (
    <Card className="bg-card text-card-foreground p-6 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 bg-secondary rounded" />
          <div className="h-5 w-16 bg-secondary rounded" />
        </div>
        
        <div className="flex space-x-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-secondary rounded-full" />
              <div className="h-3 w-12 bg-secondary rounded" />
              <div className="h-2 w-8 bg-secondary rounded" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
