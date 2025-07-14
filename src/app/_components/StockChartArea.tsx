"use client";
import { AreaChart, CartesianGrid, XAxis, YAxis, Legend, Area } from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// const data = [
//   { time: "17.30", price: 400 },
//   { time: "18.30", price: 300 },
//   { time: "19.30", price: 500 },
//   { time: "20.30", price: 200 },
//   { time: "21.30", price: 100 },
// ];

export default function StockChartArea() {
  const { data, error, isLoading } = useSWR("/api/stock-prices", fetcher, {
    refreshInterval: 30_000, // 30 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

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
