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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6699'];

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
    handler: async ({ userId }: any) => {
      debugger
      let userPRData = prData.filter((pr: PRData) => pr.userId === userId);
      console.log(userPRData, userId);
    },
    render: ({ args }) => {
      const [userPRData, setUserPRData] = useState<any[]>([])
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
      useEffect(() => {
        console.log(args?.userId, prData.filter((pr: PRData) => pr.userId === args?.userId))
        const pieData = Object.entries(getStatusCounts(prData.filter((pr: PRData) => pr.userId === args?.userId))).map(([status, count]) => ({
          name: status,
          value: count,
        }));
        setUserPRData(pieData)
      }, [args?.userId])
      const getStatusCounts = (data: PRData[]) => {
        return data.reduce((acc: any, pr: PRData) => {
          acc[pr.status] = (acc[pr.status] || 0) + 1;
          return acc;
        }, {});
      }
      return (
        <div className="flex-1 p-4 rounded-2xl shadow-lg flex flex-col items-center min-w-[250px] max-w-[350px]">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 text-center">PR Status Distribution</h2>
          <div className="h-[180px] flex flex-col items-center justify-center">
            <PieChart width={260} height={180}>
              <Pie
                data={userPRData}
                cx={130}
                cy={90}
                innerRadius={30}
                outerRadius={70}
                paddingAngle={0}
                dataKey="value"
                labelLine={false}
                label={({ value }) => value}
              >
                {userPRData.map((entry, index: number) => (
                  <Cell key={`cell-${index}`} fill={status.find((s: any) => s.name === entry.name)?.value} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              {/* <Tooltip contentStyle={{ background: '', border: 'none', color: 'white' }} /> */}
            </PieChart>
          </div>
          <div className="flex flex-col items-center mt-4">
            {chunkArray(status, 2).map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="flex flex-row justify-center items-center gap-x-6 gap-y-2 w-full"
              >
                {row.map((entry: any) => (
                  <div key={entry.name} className="flex items-center gap-1 min-w-[110px]">
                    <span
                      className={`inline-block w-4 h-4 rounded-full ${entry.color}`}
                      // style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-black">{entry.name.split("_").join(" ")}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )
    }
  })


  async function getPRData() {
    try {
      const res = await getPRDataService()
      setPrData(res)
      console.log(res)
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


const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name } = payload[0].payload;
    return (
      <div className="bg-white p-2 rounded shadow text-black">
        {name.split("_").join(" ")}
      </div>
    );
  }
  return null;
};


function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
