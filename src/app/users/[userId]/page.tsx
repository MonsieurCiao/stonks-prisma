"use server";
import React from "react";
import { prisma } from "../../../../lib/prisma";
import Charts from "../_components/Charts";
import AddOrder from "../_components/AddOrder";
import OrderList from "../_components/OrderList";

export default async function User({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolved = await params;

  const curUser = await prisma.user.findUnique({
    where: { id: resolved.userId },
    include: {
      assets: true,
    },
  });

  if (!curUser) {
    return <div>User not found</div>;
  }

  // Fetch latest prices for only the user's assets
  const stockSymbols = curUser.assets.map((asset) => asset.stockSymbol);

  const latestPrices = await prisma.stockPrice.findMany({
    where: {
      stockSymbol: { in: stockSymbols },
    },
    orderBy: {
      time: "desc",
    },
    distinct: ["stockSymbol"], // Ensures one latest price per symbol
  });

  // Create a lookup map
  const priceMap = Object.fromEntries(
    latestPrices.map((price) => [price.stockSymbol, price.avgPrice])
  );

  return (
    <div className="flex flex-col items-center min-h-screen position-relative p-4">
      <Charts />
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
        <AddOrder userId={curUser.id} />
        <OrderList userId={curUser.id} />
      </div>
    </div>
  );
}
