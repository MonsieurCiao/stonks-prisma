"use client";
import Head from "next/head";
import React, { useRef, useEffect, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CandleChart() {
  const candleChartRef = useRef<HTMLDivElement>(null);
  const { data, error, isLoading } = useSWR("/api/stock-ohlc", fetcher, {
    refreshInterval: 60_000, // 60 seconds
  });

  const draw = useMemo(
    () => () => {
      if (!data || isLoading || error) return;

      const dataTable = new google.visualization.DataTable();
      dataTable.addColumn("string", "Time");
      dataTable.addColumn("number", "Open");
      dataTable.addColumn("number", "High");
      dataTable.addColumn("number", "Low");
      dataTable.addColumn("number", "Close");

      data.forEach(
        (item: {
          time: string;
          open: number;
          high: number;
          low: number;
          close: number;
        }) => {
          dataTable.addRow([
            item.time,
            item.open,
            item.high,
            item.low,
            item.close,
          ]);
        }
      );

      const options = {
        title: "Stock OHLC Chart",
        // legend: { position: "bottom" },
        // hAxis: { title: "Time" },
        // vAxis: { title: "Price" },
        // candlestick: {
        //   fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
        //   risingColor: { strokeWidth: 0, fill: "#0f9d58" }, // green
        // },
      };

      const chart = new google.visualization.CandlestickChart(
        candleChartRef.current as HTMLDivElement
      );
      chart.draw(dataTable, options);
    },
    [data, isLoading, error]
  );

  useEffect(() => {
    // Load Google Charts library
    google.charts.load("current", {
      packages: ["corechart", "line"],
    });
    google.charts.setOnLoadCallback(draw);
  }, [draw]);
  return (
    <div>
      <Head>
        <script
          type="text/javascript"
          src="https://www.gstatic.com/charts/loader.js"
        ></script>
      </Head>
      <div ref={candleChartRef} className="w-full h-96"></div>
    </div>
  );
}
