"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Post } from "@/lib/types"
import { Card } from "@/components/ui/card"

export function PostsGrid({ username }: { username?: string }) {
  const key = username ? `/api/posts?username=${encodeURIComponent(username)}` : "/api/posts"
  const { data, error } = useSWR<Post[]>(key, fetcher)
  if (error) return <div className="text-destructive">Failed to load posts.</div>
  if (!data) return <GridSkeleton />

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((post) => (
          <Card key={post.id} className="bg-card text-card-foreground overflow-hidden rounded-lg">
            <img
              src={post.imageUrl || "/placeholder.svg"}
              alt={`Post ${post.id}`}
              className="w-full h-56 object-cover"
              width={420}
              height={420}
            />
            <div className="p-4">
              <p className="text-pretty">{post.caption}</p>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span>❤️ {Intl.NumberFormat().format(post.likes)}</span>
                <span>💬 {Intl.NumberFormat().format(post.comments)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <Badge label={`Vibe: ${post.vibe}`} />
                <Badge label={`Quality: ${post.quality}`} tone="accent" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Badge({ label, tone = "muted" }: { label: string; tone?: "muted" | "accent" }) {
  const toneClass = tone === "accent" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
  return <span className={`px-2 py-0.5 rounded-md text-xs ${toneClass}`}>{label}</span>
}

function GridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-card p-0 overflow-hidden">
          <div className="h-56 bg-secondary" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-secondary rounded" />
            <div className="h-4 w-1/3 bg-secondary rounded" />
            <div className="h-6 w-1/2 bg-secondary rounded" />
          </div>
        </Card>
      ))}
    </div>
  )
}
