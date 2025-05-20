"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

interface DataChartProps {
  data: Record<string, any>[]
}

export function DataChart({ data }: DataChartProps) {
  // Extract keys excluding 'name'
  const dataKeys = Object.keys(data[0]).filter((key) => key !== "name")

  // Generate colors for each data key
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  return (
    <div className="h-[400px] w-full">
      <style jsx global>{`
        :root {
          --chart-1: 221 83% 53%;
          --chart-2: 142 76% 36%;
          --chart-3: 355 78% 56%;
          --chart-4: 43 96% 56%;
          --chart-5: 262 83% 58%;
        }
        .dark {
          --chart-1: 217 91% 60%;
          --chart-2: 142 71% 45%;
          --chart-3: 346 84% 61%;
          --chart-4: 48 96% 53%;
          --chart-5: 269 80% 64%;
        }
      `}</style>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
            itemStyle={{ padding: "4px 0" }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px" }}
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
          {dataKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
