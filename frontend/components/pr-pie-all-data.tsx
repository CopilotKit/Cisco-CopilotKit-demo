import { Cell } from "recharts";
import { PRData } from "@/app/Interfaces/interface";
import { useSharedContext } from "@/lib/shared-context";
import { useEffect, useState } from "react";
import { Pie, PieChart, Tooltip } from "recharts";

export function PRPieData({ args }: any) {
    const [userPRData, setUserPRData] = useState<any[]>([])
    const { prData } = useSharedContext()
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
        console.log(args?.userId)
        const pieData = Object.entries(getStatusCounts(prData.filter((pr: PRData) => pr.userId === args?.userId))).map(([status, count]) => ({
            name: status,
            value: count,
        }));
        setUserPRData(pieData)
    }, [args])
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


export const CustomPieTooltip = ({ active, payload }: any) => {
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


export function chunkArray(array: any, size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
