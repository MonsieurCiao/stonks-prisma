"use client";
// import useSWR from "swr";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CandleChart() {
  // const { data, error, isLoading } = useSWR("/api/stock-ohlc", fetcher, {
  //   refreshInterval: 60_000, // 60 seconds
  // });
  const options: ApexOptions = {
    series: [
      {
        data: [
          {
            x: new Date(1538778600000),
            y: [6629.81, 6650.5, 6623.04, 6633.33],
          },
          {
            x: new Date(1538780400000),
            y: [6632.01, 6643.59, 6620, 6630.11],
          },
          // more data...
        ],
      },
    ],
    chart: {
      type: "candlestick",
      height: 350,
    },
    title: {
      text: "CandleStick Chart",
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

  return (
    <>
      <ApexChart
        type="candlestick"
        options={options}
        series={options.series}
        height={200}
        width={500}
      />
    </>
  );
}
