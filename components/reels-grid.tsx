"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Reel } from "@/lib/types"
import { Card } from "@/components/ui/card"

export function ReelsGrid({ username }: { username?: string }) {
  const key = username ? `/api/reels?username=${encodeURIComponent(username)}` : "/api/reels"
  const { data, error } = useSWR<Reel[]>(key, fetcher)
  if (error) return <div className="text-destructive">Failed to load reels.</div>
  if (!data) return <GridSkeleton />

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Reels</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((reel) => (
          <Card key={reel.id} className="bg-card text-card-foreground overflow-hidden rounded-lg">
            <img
              src={reel.thumbnailUrl || "/placeholder.svg"}
              alt={`Reel ${reel.id}`}
              className="w-full h-56 object-cover"
              width={420}
              height={420}
            />
            <div className="p-4">
              <p className="text-pretty">{reel.caption}</p>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span>▶️ {Intl.NumberFormat().format(reel.views)}</span>
                <span>❤️ {Intl.NumberFormat().format(reel.likes)}</span>
                <span>💬 {Intl.NumberFormat().format(reel.comments)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {reel.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <span className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">{`Vibe: ${reel.vibe}`}</span>
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
          <div className="h-56 bg-secondary" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-secondary rounded" />
            <div className="h-4 w-1/3 bg-secondary rounded" />
          </div>
        </Card>
      ))}
    </div>
  )
}
