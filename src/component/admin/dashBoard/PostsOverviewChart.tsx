import { AggregationAPI } from "@/service/api/AggregationAPI"
import { Skeleton } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

export default function PostsOverviewChart() {
  const { data, isLoading } = useQuery({
    queryFn: async () => await AggregationAPI.getDailyStats(),
    queryKey: ["posts-overview"],
    refetchInterval: 60 * 1000,
  })

  if (isLoading || !data) {
    return <Skeleton className="w-full h-full rounded-xl" />
  }

  return (
    <div className="w-full h-[400px] bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-white">
        Platform Growth - Last 30 Days
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <YAxis tick={{ fill: "#666", fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            labelFormatter={(label) => `Date: ${label}`}
            formatter={(value: number, name: string) => [
              value,
              name === "posts" ? "Posts Created" : "Users Joined",
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "posts" ? "Posts Created" : "Users Joined"
            }
          />
          <Line
            type="monotone"
            dataKey="posts"
            stroke="#4f46e5"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
