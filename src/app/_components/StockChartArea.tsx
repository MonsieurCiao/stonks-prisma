"use client";
import { AreaChart, CartesianGrid, XAxis, YAxis, Legend, Area } from "recharts";

export default function StockChartArea({
  data,
}: {
  data: { time: string; price: number }[];
}) {
  return (
    <AreaChart width={600} height={300} data={data}>
      <CartesianGrid />
      <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
      <XAxis dataKey="time" />
      <YAxis />
      <Legend />
    </AreaChart>
  );
}
