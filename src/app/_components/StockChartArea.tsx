"use client";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Area,
  LineChart,
  Line,
} from "recharts";
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
    refreshInterval: 60_000, // 60 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    //need to implement zooming and panning
    //https://recharts.org/en-US/examples/ZoomableLineChart
    <div className="flex flex-col justify-center items-center gap-4">
      <AreaChart width={730} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
        <XAxis dataKey="time" />
        <YAxis />
        <Legend />
      </AreaChart>
      <LineChart
        width={730}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
