"use client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CandleChart() {
  const { data, error, isLoading } = useSWR("/api/stock-ohlc", fetcher, {
    refreshInterval: 60_000, // every 60 seconds
  });

  const transformedSeries = data
    ? [
        {
          data: data
            .map((point: any) => {
              const now = new Date();
              const [hours, minutes] = point.time.split(":").map(Number);
              const datetime = new Date(now);
              datetime.setHours(hours);
              datetime.setMinutes(minutes);
              datetime.setSeconds(0);
              datetime.setMilliseconds(0);
              return {
                x: datetime,
                y: [point.open, point.high, point.low, point.close],
              };
            })
            .reverse(), // optional: ensure chronological order
        },
      ]
    : [];

  const options: ApexOptions = {
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "Stock Candle Chart (GLSCH)",
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  if (error) return <div>Failed to load chart data</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <ApexChart
      type="candlestick"
      options={options}
      series={transformedSeries}
      height={350}
      width={600}
    />
  );
}
