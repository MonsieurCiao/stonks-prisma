"use client";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StockChartArea({
  stockSymbol,
}: {
  stockSymbol: string;
}) {
  const url = `/api/stock-prices?symbol=${stockSymbol}`;
  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 60_000, // 60 seconds
  });

  const highestPoint = data
    ? Math.max(...data.map((d: { time: string; price: number }) => d.price))
    : 0;
  const lowestPoint = data
    ? Math.min(...data.map((d: { time: string; price: number }) => d.price))
    : 0;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="w-full h-[300px] flex flex-col justify-center items-center gap-4">
      <ResponsiveContainer width="100%" height={"100%"}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[lowestPoint, highestPoint]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
