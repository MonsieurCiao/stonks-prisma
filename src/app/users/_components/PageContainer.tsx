"use client";
import React from "react";
import Charts from "./Charts";
import AddOrder from "./AddOrder";
import OrderList from "./OrderList";
import { stocks, StockSymbol } from "../../../../lib/constants";

export default function PageContainer({
  curUser,
  priceMap,
}: {
  curUser: {
    name: string;
    money: number;
    id: string;
    assets: { stockSymbol: string; quantity: number; boughtFor: number }[];
  };
  priceMap: Record<string, number>;
}) {
  const [sharedStock, setSharedStock] = React.useState<StockSymbol>(stocks[0]);

  return (
    <div className="flex flex-col items-center min-h-screen position-relative p-4">
      <Charts sharedStock={sharedStock} setSharedStock={setSharedStock} />
      <div className="mt-10 text-2xl text-center">
        <h1 className="text-4xl">{curUser.name}</h1>
      </div>
      <div className="mt-8 text-lg text-center border-2 border-border rounded-lg px-8 py-4">
        <p className="text-2xl mb-4">${curUser.money.toFixed(2)}</p>
        <p className="mb-1">Assets:</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {curUser.assets.length > 0 ? (
            curUser.assets.map((asset) => {
              const price = priceMap[asset.stockSymbol] ?? 5;
              const currentValue = asset.quantity * price;
              const profit = currentValue - asset.boughtFor;
              return (
                <div
                  key={asset.stockSymbol}
                  className={`border p-2 rounded-lg ${
                    profit > 0 ? "border-green-300" : "border-gray-300"
                  }`}
                >
                  <p>
                    {asset.stockSymbol}: {asset.quantity} shares
                  </p>
                  <p>Gekauft für: ${asset.boughtFor.toFixed(2)}</p>
                  <p>Wert: ${currentValue.toFixed(2)}</p>
                </div>
              );
            })
          ) : (
            <p>- no assets -</p>
          )}
        </div>
      </div>
      <div className="mt-12 text-lg flex flex-col md:flex-row justify-center items-center gap-10 md:gap-4 md:items-start md:justify-between w-full max-w-2xl px-4">
        <AddOrder
          userId={curUser.id}
          sharedStock={sharedStock}
          setSharedStock={setSharedStock}
        />
        <OrderList userId={curUser.id} />
      </div>
    </div>
  );
}
