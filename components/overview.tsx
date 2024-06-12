"use client";

import { priceFormatter } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: any[];
}

const Overview = ({ data }: OverviewProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey={"name"}
          stroke="#555"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#555"
          width={80}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${priceFormatter.format(value)}`}
        />

        <Bar dataKey={"total"} fill="#810CA8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
