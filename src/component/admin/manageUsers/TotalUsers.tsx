import { Card, CardBody } from "@heroui/react"
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Label,
  Legend,
  Tooltip,
} from "recharts"

const data = [
  { name: "Verified", value: 50 },
  { name: "Not Verified", value: 450 },
]
const COLORS = ["#00C49F", "#FF8042"]

export default function TotalUsers() {
  const totalUsers = 500
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


import { TooltipProps } from "recharts"
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"

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