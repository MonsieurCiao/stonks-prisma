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
type StockPrice = {
  id: string;
  stockSymbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  time: Date;
  avgPrice: number;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StockChartArea() {
  const { data, error, isLoading } = useSWR("/api/stock-prices", fetcher, {
    refreshInterval: 60_000, // 60 seconds
  });
  // Format to [{ time, price }]
  if (!data || data === undefined) return <div>Loading...</div>;
  const formattedData = data.map((p: StockPrice) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: Math.round(p.avgPrice * 100) / 100,
  }));
  const highestPoint = formattedData
    ? Math.max(
        ...formattedData.map((d: { time: string; price: number }) => d.price)
      )
    : 0;
  const lowestPoint = formattedData
    ? Math.min(
        ...formattedData.map((d: { time: string; price: number }) => d.price)
      )
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
        data={formattedData.reverse()}
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
