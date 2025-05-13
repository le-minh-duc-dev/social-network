import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { UserAPI } from "@/service/UserAPI"
import { Card, CardBody, Skeleton } from "@heroui/react"
import { useQueries } from "@tanstack/react-query"
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Label,
  Legend,
  Tooltip,
  TooltipProps,
} from "recharts"

import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent"

const COLORS = ["#00C49F", "#FF8042"]

export default function TotalUsers() {
  const results = useQueries({
    queries: [
      {
        queryKey: [QueryKey.GET_USERS, "count"],
        queryFn: UserAPI.getTotalUsers,
        staleTime: QueryStaleTime[QueryKey.GET_USERS],
      },
      {
        queryKey: [QueryKey.GET_USERS, "count", "verified"],
        queryFn: UserAPI.getVerifiedUsers,
        staleTime: QueryStaleTime[QueryKey.GET_USERS],
      },
    ],
  })

  const [totalUsersRe, verifiedUsersRe] = results

  const totalUsers = totalUsersRe.data?.count ?? 0
  const verifiedUsers = verifiedUsersRe.data?.count ?? 0
  const notVerifiedUsers = totalUsers - verifiedUsers

  const data = [
    { name: "Verified", value: verifiedUsers },
    { name: "Not Verified", value: notVerifiedUsers },
  ]

  if (totalUsersRe.isLoading || verifiedUsersRe.isLoading)
    return (
      <Card className="h-[300px] w-[500px]   ">
        <Skeleton className="w-full h-full" />
      </Card>
    )

  return (
    <Card className="h-[300px] w-[500px]   ">
      <CardBody>
        <div className="flex flex-1 overflow-hidden justify-between ">
          <h2 className="text-xl">Users:</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={800} height={300}>
              <Pie
                data={data}
                cx={200}
                cy={100}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <Label
                  value={"Total: " + totalUsers}
                  position="center"
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fill: "#999",
                  }}
                />
                {/* <LabelList
                  dataKey="value"
                  position="outside"
                  style={{
                    fill: "#ddd", // text color
                    fontSize: "12px",
                    letterSpacing: 1,
                  }}
                /> */}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  )
}

// Your custom tooltip component
const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0]

  return (
    <div className="bg-default-100  rounded-md shadow-md px-4 py-2 text-sm ">
      <p className="font-semibold">{data.name}</p>
      <p>Users: {data.value}</p>
    </div>
  )
}
