"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { DataChart } from "@/components/data-chart"
import { Button } from "@/components/ui/button"
import { BarChart3, Table2 } from "lucide-react"

// Sample data for the developer dashboard
const tableColumns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Repository",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "lastCommit",
    header: "Last Commit",
  },
  {
    accessorKey: "buildTime",
    header: "Build Time",
  },
]

const tableData = [
  {
    id: "DEV-1001",
    name: "api-gateway",
    status: "Healthy",
    lastCommit: "2 hours ago",
    buildTime: "45s",
  },
  {
    id: "DEV-1002",
    name: "user-service",
    status: "Warning",
    lastCommit: "1 day ago",
    buildTime: "62s",
  },
  {
    id: "DEV-1003",
    name: "payment-processor",
    status: "Healthy",
    lastCommit: "3 hours ago",
    buildTime: "38s",
  },
  {
    id: "DEV-1004",
    name: "notification-service",
    status: "Critical",
    lastCommit: "5 days ago",
    buildTime: "71s",
  },
  {
    id: "DEV-1005",
    name: "analytics-engine",
    status: "Healthy",
    lastCommit: "12 hours ago",
    buildTime: "52s",
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

export function DeveloperDashboard() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")

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
            <DataTable columns={tableColumns} data={tableData} />
          ) : (
            <DataChart data={chartData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
