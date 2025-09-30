import { ProfileCard } from "@/components/profile-card"
import { StoriesHighlights } from "@/components/stories-highlights"
import { HighlightsSection } from "@/components/highlights-section"
import { AnalyticsSection } from "@/components/analytics-charts"
import { PostsGrid } from "@/components/posts-grid"
import { ReelsGrid } from "@/components/reels-grid"
import { SearchHeader } from "@/components/search-header"

export default function Page({ searchParams }: { searchParams?: { username?: string } }) {
  const username = searchParams?.username
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance">Instagram Profile Dashboard</h1>
        <div className="flex items-center gap-2">
          <a href="#posts" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
            View Posts
          </a>
          <a href="#reels" className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground text-sm">
            View Reels
          </a>
          <SearchHeader />
        </div>
      </header>

      <section className="space-y-6">
        <ProfileCard username={username} />
        <StoriesHighlights username={username} />
        <HighlightsSection username={username} />
        <AnalyticsSection username={username} />
      </section>

      <section id="posts" className="mt-8 space-y-4">
        <PostsGrid username={username} />
      </section>

      <section id="reels" className="mt-8 space-y-4">
        <ReelsGrid username={username} />
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          {"© "}
          {new Date().getFullYear()} {username ? username : "Abhishek Yadav "}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
