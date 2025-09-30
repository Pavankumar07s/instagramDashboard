"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

export function SearchHeader() {
  const router = useRouter()
  const params = useSearchParams()
  const initial = params.get("username") || ""
  const [value, setValue] = useState(initial)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Keep input in sync if user navigates back/forward
    const current = params.get("username") || ""
    setValue(current)
    setIsSearching(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    
    setIsSearching(true)
    const next = `?username=${encodeURIComponent(q)}`
    router.push(`/${next}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Instagram username..."
          aria-label="Search username"
          className={`transition-all ${!initial ? 'w-72 border-primary pr-10' : 'w-56 pr-10'}`}
          autoFocus={!initial}
          disabled={isSearching}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <Button type="submit" className="px-4 py-1.5 text-sm" disabled={isSearching || !value.trim()}>
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          !initial ? 'Analyze Profile' : 'Search'
        )}
      </Button>
    </form>
  )
}
