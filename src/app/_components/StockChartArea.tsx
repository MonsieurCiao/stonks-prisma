"use client";
import { AreaChart, CartesianGrid, XAxis, YAxis, Legend, Area } from "recharts";
const data = [
  { name: "17.30", uv: 400, pv: 2400, amt: 2400 },
  { name: "18.30", uv: 300, pv: 2400, amt: 2400 },
  { name: "19.30", uv: 500, pv: 2400, amt: 2400 },
  { name: "20.30", uv: 200, pv: 2400, amt: 2400 },
  { name: "21.30", uv: 100, pv: 2400, amt: 2400 },
];

export default function StockChartArea() {
  return (
    <AreaChart width={600} height={300} data={data}>
      <CartesianGrid />
      <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      <XAxis dataKey="name" />
      <YAxis />
      <Legend />
    </AreaChart>
  );
}
