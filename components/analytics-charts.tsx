"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Analytics } from "@/lib/types"
import { Card } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsSection({ username }: { username?: string }) {
  // Always call hooks at the top level
  const key = username ? `/api/analytics?username=${encodeURIComponent(username)}` : null
  const { data, error } = useSWR<Analytics>(key, fetcher)

  // Show welcome message when no username is provided
  if (!username) {
    return (
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-8 bg-card text-card-foreground md:col-span-2">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Analytics to Display</h3>
              <p className="text-muted-foreground">
                Search for an Instagram username to view detailed engagement analytics, audience demographics, and performance trends.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3 mt-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-muted">0</div>
                <div className="text-sm text-muted-foreground">Avg Likes</div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-muted">0</div>
                <div className="text-sm text-muted-foreground">Avg Comments</div>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-muted">0%</div>
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    )
  }

  if (error) return <div className="text-destructive">Failed to load analytics for @{username}.</div>
  if (!data)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 bg-card">
          <div className="h-40 bg-secondary rounded animate-pulse" />
        </Card>
        <Card className="p-4 bg-card">
          <div className="h-40 bg-secondary rounded animate-pulse" />
        </Card>
        <Card className="p-4 bg-card md:col-span-2">
          <div className="h-64 bg-secondary rounded animate-pulse" />
        </Card>
      </div>
    )

  const palette = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card className="p-4 bg-card text-card-foreground">
        <h2 className="text-lg font-semibold mb-2">Engagement Overview</h2>
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Avg Likes" value={Intl.NumberFormat().format(data.avgLikes)} />
          <Metric label="Avg Comments" value={Intl.NumberFormat().format(data.avgComments)} />
          <Metric label="Eng. Rate" value={`${data.engagementRate}%`} />
        </div>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trend}>
              <XAxis dataKey="index" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  color: "var(--color-card-foreground)",
                  border: `1px solid var(--color-border)`,
                }}
                formatter={(value, name) => [
                  Intl.NumberFormat().format(Number(value)),
                  name === 'likes' ? 'Likes' : 'Comments'
                ]}
                labelFormatter={(label) => `Post ${label}`}
              />
              <Line type="monotone" dataKey="likes" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="comments" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4 bg-card text-card-foreground">
        <h2 className="text-lg font-semibold mb-2">Likes vs Comments</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trend}>
              <XAxis dataKey="index" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  color: "var(--color-card-foreground)",
                  border: `1px solid var(--color-border)`,
                }}
                formatter={(value, name) => [
                  Intl.NumberFormat().format(Number(value)),
                  name === 'likes' ? 'Likes' : 'Comments'
                ]}
                labelFormatter={(label) => `Post ${label}`}
              />
              <Bar dataKey="likes" fill="var(--color-chart-1)" />
              <Bar dataKey="comments" fill="var(--color-chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {data.demographics && (
        <Card className="p-4 bg-card text-card-foreground md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Audience Demographics</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Gender Distribution */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Gender Split</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Female", value: data.demographics.gender.female },
                        { name: "Male", value: data.demographics.gender.male },
                        { name: "Other", value: data.demographics.gender.other },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {[0, 1, 2].map((i) => (
                        <Cell key={i} fill={palette[i % palette.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        color: "var(--color-card-foreground)",
                        border: `1px solid var(--color-border)`,
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Age Distribution */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Age Groups</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.demographics.age} layout="horizontal">
                    <XAxis type="number" stroke="var(--color-muted-foreground)" />
                    <YAxis dataKey="range" type="category" stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        color: "var(--color-card-foreground)",
                        border: `1px solid var(--color-border)`,
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Bar dataKey="percent" fill="var(--color-chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Top Countries</h3>
              <div className="space-y-3">
                {data.demographics.geography.slice(0, 5).map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="text-sm">{country.country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-chart-1 rounded-full" 
                          style={{ width: `${country.percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{country.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  )
}
