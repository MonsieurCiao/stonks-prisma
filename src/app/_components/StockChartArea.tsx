"use client";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  Tooltip,
} from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StockChartArea() {
  const { data, error, isLoading } = useSWR("/api/stock-prices", fetcher, {
    refreshInterval: 60_000, // 60 seconds
  });

  const highestPoint = data[0]
    ? Math.max(...data[0].map((d: { time: string; price: number }) => d.price))
    : 0;
  const lowestPoint = data[0]
    ? Math.min(...data[0].map((d: { time: string; price: number }) => d.price))
    : 0;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    //need to implement zooming and panning
    //https://recharts.org/en-US/examples/ZoomableLineChart
    <div className="flex flex-col justify-center items-center gap-4">
      <LineChart
        width={730}
        height={300}
        data={data[0].reverse()}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[lowestPoint, highestPoint]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
