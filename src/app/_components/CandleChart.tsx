"use client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CandleChart({ stockSymbol }: { stockSymbol: string }) {
  const url = `/api/stock-ohlc?symbol=${stockSymbol}`;
  const { data, error, isLoading } = useSWR(url, fetcher, {
    refreshInterval: 60_000, // every 60 seconds
  });

  const transformedSeries = data
    ? [
        {
          data: data
            .map(
              (point: {
                time: string;
                open: number;
                high: number;
                low: number;
                close: number;
              }) => ({
                x: new Date(point.time).getTime(),
                y: [point.open, point.high, point.low, point.close],
              })
            )
            .reverse(), // optional: ensure chronological order
        },
      ]
    : [];
  console.log(transformedSeries);

  const options: ApexOptions = {
    tooltip: {
      style: {
        fontFamily: "Inter, sans-serif",
      },
      theme: "dark",
    },
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: `Stock Candle Chart (${stockSymbol})`,
      align: "left",
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: true,
        formatter(value) {
          const date = new Date(value);
          return `${date.toLocaleTimeString()}`;
        },
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#8FFBB3",
          downward: "#DD3559",
        },
      },
    },
  };

  if (error) return <div>Failed to load chart data</div>;
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div className="w-full h-[350px]">
      <ApexChart
        type="candlestick"
        options={options}
        series={transformedSeries}
        height={350}
        width={"100%"}
      />
    </div>
  );
}
