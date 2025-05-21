"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { DataChart } from "@/components/data-chart"
import { Button } from "@/components/ui/button"
import { BarChart3, Table2, Filter } from "lucide-react"
import { getPRDataService } from "@/app/Services/service"
import { PRData } from "@/app/Interfaces/interface"
import { useSharedContext } from "@/lib/shared-context"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { PRPieData } from "./pr-pie-all-data"
import { PRReviewBarData } from "./pr-review-bar-data"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { PRPieFilterData } from "./pr-pie-filter-data"
import { PRLineChartData } from "./pr-line-chart-data"
import { Loader } from "./ui/loader"
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

export function DeveloperDashboard() {
  const { prData, setPrData } = useSharedContext()
  const [filteredData, setFilteredData] = useState<PRData[]>([])
  const [filterParams, setFilterParams] = useState<{ status: string, author: string }>({ status: "a", author: "b" })
  const [viewMode, setViewMode] = useState<"table" | "chart">("table")
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    getPRData()
  }, [])

  useCopilotReadable({
    description: "A list of all the PR Data",
    value: JSON.stringify(prData)
  })

  useCopilotReadable({
    description: "The currently logged in username and userId",
    value: JSON.stringify({ username: "Jon.Snow@got.com", userId: 1 })
  })

  useCopilotAction({
    name: "renderData_PieChart",
    description: `Render a Pie-chart for labelled numeric data. Example input format: [{"name": "approved", "value": 25, "shortName": "Approved", "color": "rgb(134 239 172)"}, {"name": "in_review", "value": 15, "shortName": "In Review", "color": "rgb(216 180 254)"}, {"name": "needs_revision", "value": 10, "shortName": "Needs Revision", "color": "rgb(253 224 71)"}, {"name": "merged", "value": 5, "shortName": "Merged", "color": "rgb(147 197 253)"}] When assigning color, use the same colors if data is related to status otherwise generate random colors. Provide short name for the item in the input if the name is long. Keep it the same as the name if the name is short. For example, If the name is Jon.snow@got.com, then the short name is Jon`,
    parameters: [
      {
        name: "items",
        type: "object[]",
        description: "Array of items to be displayed in the pie chart",
        required: true,
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the item", required: true },
            shortName: { type: "string", description: "Short Name of the item", required: true },
            value: { type: "number", description: "Value of the item", required: true },
            color: { type: "string", description: "Color of the item", required: true }
          }
        }
      }
    ],
    render: ({ args }: any) => {
      return <PRPieData args={args} />


    }
  })

  useCopilotAction({
    name: "renderData_BarChart",
    description: `Render a Bar-chart for labelled numeric data. Example input format: [{"name": "approved", "value": 25, "color": "rgb(134 239 172)"}, {"name": "in_review", "value": 15, "color": "rgb(216 180 254)"}, {"name": "needs_revision", "value": 10, "color": "rgb(253 224 71)"}, {"name": "merged", "value": 5, "color": "rgb(147 197 253)"}] When assigning color, use the same colors if data is related to status otherwise generate random colors. Provide short name for the item in the input if the name is long. Keep it the same as the name if the name is short. For example, If the name is Jon.snow@got.com, then the short name is Jon`,
    parameters: [
      {
        name: "items",
        type: "object[]",
        description: "Array of items to be displayed in the bar chart",
        required: true,
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the item", required: true },
            value: { type: "number", description: "Value of the item", required: true },
            // color: { type: "string", description: "Color of the item", required: true }
          }
        }
      }
    ],
    render: ({ args }: any) => {
      return <PRReviewBarData args={args} />
    }
  })


  useCopilotAction({
    name: "renderData_LineChart",
    description: `Render a Line-chart based on the PR data which shows the trend of PR creation over time. Example input format: [{"name": "12/25", "value": 10}, {"name": "7/22", "value": 20}, {"name": "12/18", "value": 30}]. If dates are present convert them to the format "MM/DD". Also if name length is long, provide short name for the item in the input. For example, If the name is Jon.snow@got.com, then the short name is Jon`,
    parameters: [
      {
        name: "items",
        type: "object[]",
        description: "The data to be displayed in the line chart",
        required: true,
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "The name of the item", required: true },
          }
        }
      }
    ],
    render: ({ args }: any) => {
      return <PRLineChartData args={args} />
    }
  })


  useCopilotAction({
    name: "renderData_Table",
    description: `Render a table based on the PR data. Example input format: {id: 'PR22',title: 'Add Longclaw sword animation effects',status: 'needs_revision',assignedReviewer: 'lisa.martin@got.com',assignedTester: 'sarah.wilson@got.com',daysSinceStatusChange: 2,createdAt: '2025-04-22T18:41:32.868Z',updatedAt: '2025-05-18T04:36:14.176Z',userId: 1,author: 'Jon.snow@got.com',repository: 'frontend',branch: 'feature/longclaw-animations'}`,
    parameters: [
      {
        name: "items",
        type: "object[]",
        description: "The data to be displayed in the table. It should be an array of objects",
        required: true,
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "The id of the PR", required: true },
            title: { type: "string", description: "The title of the PR", required: true },
            status: { type: "string", description: "The status of the PR", required: true },
            assignedReviewer: { type: "string", description: "The assigned reviewer of the PR", required: true },
            assignedTester: { type: "string", description: "The assigned tester of the PR", required: true },
            daysSinceStatusChange: { type: "number", description: "The number of days since the status of the PR was changed", required: true },
            createdAt: { type: "string", description: "The date and time when the PR was created", required: true },
            updatedAt: { type: "string", description: "The date and time when the PR was last updated", required: true },
            userId: { type: "number", description: "The id of the user who created the PR", required: true },
            author: { type: "string", description: "The author of the PR", required: true },
            repository: { type: "string", description: "The repository of the PR", required: true },
            branch: { type: "string", description: "The branch of the PR", required: true },
          }

        }
      }
    ],
    handler: (items: any) => {
      debugger
      setFilteredData(items.data)
    }
  })



  async function getPRData() {
    try {
      const res = await getPRDataService()
      setPrData(res)
      setFilteredData(res)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="space-y-6">
      {isLoading && <Loader />}
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

      {/* <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Repositories</CardTitle>
            <CardDescription>Total active repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
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
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle>Repository Performance</CardTitle>
          <CardDescription>Monitor build times and test coverage across repositories</CardDescription>
          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <Select>
              {/* <SelectTrigger className="w-[180px]">
<SelectValue placeholder="Repository" />
  </SelectTrigger>
  <SelectContent>
<SelectItem value="a">All Repositories</SelectItem>
<SelectItem value="frontend">frontend</SelectItem>
<SelectItem value="backend">backend</SelectItem>
<SelectItem value="docs">docs</SelectItem>
  </SelectContent> */}
            </Select>
            {viewMode === "table" && <Select value={filterParams.status} onValueChange={(e) => {
              debugger
              setFilterParams({ ...filterParams, status: e })

            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">All Statuses</SelectItem>
                <SelectItem value="approved">approved</SelectItem>
                <SelectItem value="needs revision">needs revision</SelectItem>
                <SelectItem value="merged">merged</SelectItem>
                <SelectItem value="in review">in review</SelectItem>
              </SelectContent>
            </Select>}
            <Select value={filterParams.author} onValueChange={(e) => {
              debugger
              setFilterParams({ ...filterParams, author: e })
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="b">All Authors</SelectItem>
                <SelectItem value="Jon.snow@got.com">Jon.snow@got.com</SelectItem>
                <SelectItem value="robert.baratheon@got.com">robert.baratheon@got.com</SelectItem>
                <SelectItem value="ned.stark@got.com">ned.stark@got.com</SelectItem>
                <SelectItem value="cersei.lannister@got.com">cersei.lannister@got.com</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => {
              if (filterParams.status === "a" && filterParams.author === "b") {
                setFilteredData(prData)
              } else if (filterParams.status === "a") {
                setFilteredData(prData.filter((pr: PRData) => pr.author.toLowerCase() === filterParams.author?.toLowerCase()))
              } else if (filterParams.author === "b") {
                setFilteredData(prData.filter((pr: PRData) => pr.status.split("_").join(" ").toLowerCase() === filterParams.status?.toLowerCase()))
              } else {
                setFilteredData(prData.filter((pr: PRData) => pr.status.split("_").join(" ").toLowerCase() === filterParams.status?.toLowerCase() && pr.author.toLowerCase() === filterParams.author?.toLowerCase()))
              }
            }} variant="ghost" size="sm">Apply Filters</Button>
            <Button onClick={() => { setFilteredData(prData); setFilterParams({ status: "a", author: "b" }) }} variant="ghost" size="sm">Clear Filters</Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "table" ? (
            <DataTable columns={tableColumns} data={filteredData} />
          ) : (
            <DataChart data={filteredData} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}


