"use client";
// import useSWR from "swr";
import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CandleChart() {
  // const { data, error, isLoading } = useSWR("/api/stock-ohlc", fetcher, {
  //   refreshInterval: 60_000, // 60 seconds
  // });
  const option = {
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
    },
  ];

  return (
    <>
      <ApexChart
        type="line"
        options={option}
        series={series}
        height={200}
        width={500}
      />
    </>
  );
}
