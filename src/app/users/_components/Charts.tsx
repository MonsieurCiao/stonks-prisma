"use client";
import CandleChart from "@/app/_components/CandleChart";
import React from "react";
import { stocks, StockSymbol } from "../../../../lib/constants";
import StockChartArea from "@/app/_components/StockChartArea";

export default function Charts() {
  const [isCandle, setIsCandle] = React.useState(true);
  const [stock, setStock] = React.useState<"GLSCH" | "BNSAI" | "GLDN">(
    stocks[0]
  );
  return (
    <div className="w-full">
      {isCandle ? (
        <CandleChart stockSymbol={stock} />
      ) : (
        <StockChartArea stockSymbol={stock} />
      )}
      <div className="flex gap-10 justify-end">
        <select
          name="type"
          className="border border-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          onChange={(e) => setStock(e.target.value as StockSymbol)}
        >
          <option value={stocks[0]}>Daten von {stocks[0]}</option>
          <option value={stocks[1]}>Daten von {stocks[1]}</option>
          <option value={stocks[2]}>Daten von {stocks[2]}</option>
        </select>
        <div className="flex">
          <button
            onClick={() => setIsCandle(true)}
            className={`px-2  rounded-l-lg w-full cursor-pointer ${
              isCandle
                ? "bg-secondary-blue text-white"
                : "bg-gray-200 text-border"
            }`}
          >
            Candle
          </button>
          <button
            onClick={() => setIsCandle(false)}
            className={`px-2 rounded-r-lg w-full cursor-pointer ${
              !isCandle
                ? "bg-secondary-blue text-white"
                : "bg-gray-200 text-border"
            }`}
          >
            Line
          </button>
        </div>
      </div>
    </div>
  );
}
