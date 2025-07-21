"use client";
import CandleChart from "@/app/_components/CandleChart";
import React from "react";
import { stocks } from "../../../../lib/constants";
import StockChartArea from "@/app/_components/StockChartArea";

export default function Charts({
  sharedStock,
  setSharedStock,
}: {
  sharedStock: string;
  setSharedStock: (stock: string) => void;
}) {
  const [isCandle, setIsCandle] = React.useState(true);
  return (
    <div className="w-full">
      {isCandle ? (
        <CandleChart stockSymbol={sharedStock} />
      ) : (
        <StockChartArea stockSymbol={sharedStock} />
      )}
      <div className="flex gap-10 justify-end">
        <select
          name="type"
          className="border border-border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          onChange={(e) =>
            setSharedStock(
              e.target.value as
                | (typeof stocks)[0]
                | (typeof stocks)[1]
                | (typeof stocks)[1]
            )
          }
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
