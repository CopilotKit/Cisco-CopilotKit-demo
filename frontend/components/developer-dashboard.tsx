"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { DataChart } from "@/components/data-chart"
import { Button } from "@/components/ui/button"
import { BarChart3, Table2 } from "lucide-react"
import { getPRDataService } from "@/app/Services/service"
import { PRData } from "@/app/Interfaces/interface"
import { useSharedContext } from "@/lib/shared-context"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { PRPieData } from "./pr-pie-data"
import { PRReviewBarData } from "./pr-review-bar-data"
// Sample data for the developer dashboard
const tableColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "title",
    header: "TITLE",
  },
  {
    accessorKey: "author",
    header: "AUTHOR",
  },
  {
    accessorKey: "repository",
    header: "REPOSITORY",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
]
const chartData = [
  {
    name: "Mon",
    "Build Time": 45,
    "Test Coverage": 78,
  },
  {
    name: "Tue",
    "Build Time": 52,
    "Test Coverage": 82,
  },
  {
    name: "Wed",
    "Build Time": 48,
    "Test Coverage": 85,
  },
  {
    name: "Thu",
    "Build Time": 61,
    "Test Coverage": 79,
  },
  {
    name: "Fri",
    "Build Time": 55,
    "Test Coverage": 83,
  },
  {
    name: "Sat",
    "Build Time": 42,
    "Test Coverage": 86,
  },
  {
    name: "Sun",
    "Build Time": 38,
    "Test Coverage": 90,
  },
]

const status = [{
  name: "approved",
  color: "bg-green-300",
  value: "rgb(134 239 172)"
}, {
  name: "needs_revision",
  color: "bg-yellow-300",
  value: "rgb(253 224 71)"
}, {
  name: "merged",
  color: "bg-purple-300",
  value: "rgb(216 180 254)"
}, {
  name: "in_review",
  color: "bg-blue-300",
  value: "rgb(147 197 253)"
}]

export function DeveloperDashboard() {
  const { prData, setPrData } = useSharedContext()
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  useEffect(() => {
    getPRData()
  }, [])

  useCopilotReadable({
    description: "A list of all the PR Data",
    value: JSON.stringify(prData)
  })

  useCopilotAction({
    name: "GenerateChartBasedOnUserPRData",
    description: `Generate a pie-chart based on the PR data for a user`,
    parameters: [
      {
        name: "userId",
        type: "number",
        description: "The id of the user for whom the PR data is to be fetched",
      }
    ],
    render: ({ args }: any) => {
      return <PRPieData args={args} />
    }
  })

  useCopilotAction({
    name: "GenerateChartBasedOnPRReviewStatus",
    description: `Generate a bar-chart based on the PR data which are only in needs_revision or in_review status for specific user`,
    parameters: [
      {
        name: "userId",
        type: "number",
        description: "The id of the user for whom the PR data is to be fetched",
      }
    ],
    render: ({ args }: any) => {
      return <PRReviewBarData args={args} />
    }
  })


  async function getPRData() {
    try {
      const res = await getPRDataService()
      setPrData(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Developer Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>
            <Table2 className="mr-2 h-4 w-4" />
            Table
          </Button>
          <Button variant={viewMode === "chart" ? "default" : "outline"} size="sm" onClick={() => setViewMode("chart")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Chart
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Repositories</CardTitle>
            <CardDescription>Total active repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Build Success Rate</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">94.3%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Code Quality</CardTitle>
            <CardDescription>Average score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">A+</div>
            <p className="text-xs text-muted-foreground">Improved from A</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Repository Performance</CardTitle>
          <CardDescription>Monitor build times and test coverage across repositories</CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <DataTable columns={tableColumns} data={prData} />
          ) : (
            <DataChart data={chartData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}


