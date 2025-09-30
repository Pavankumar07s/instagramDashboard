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

export function AnalyticsSection() {
  const { data, error } = useSWR<Analytics>("/api/analytics", fetcher)

  if (error) return <div className="text-destructive">Failed to load analytics.</div>
  if (!data)
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4 bg-card">
          <div className="h-40 bg-secondary rounded" />
        </Card>
        <Card className="p-4 bg-card">
          <div className="h-40 bg-secondary rounded" />
        </Card>
        <Card className="p-4 bg-card md:col-span-2">
          <div className="h-64 bg-secondary rounded" />
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
              />
              <Bar dataKey="likes" fill="var(--color-chart-1)" />
              <Bar dataKey="comments" fill="var(--color-chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {data.demographics && (
        <Card className="p-4 bg-card text-card-foreground md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Audience Demographics</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: data.demographics.gender.male },
                      { name: "Female", value: data.demographics.gender.female },
                      { name: "Other", value: data.demographics.gender.other },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.demographics.age}>
                  <XAxis dataKey="range" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      color: "var(--color-card-foreground)",
                      border: `1px solid var(--color-border)`,
                    }}
                  />
                  <Bar dataKey="percent" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
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
