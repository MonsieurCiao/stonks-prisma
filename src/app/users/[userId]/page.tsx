"use server";
import React from "react";
import { prisma } from "../../../../lib/prisma";
import Charts from "../_components/Charts";
import OrderList from "../_components/OrderList";
import Image from "next/image";
import { StockProvider } from "../_components/selectedStockContext";
import AddOrderForm from "../_components/AddOrderForm";
import { logout } from "@/actions/authActions";

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

  const [lastTradeGLSCH, lastTradeBNSAI, lastTradeGLDN] = await Promise.all([
    prisma.stockPrice.findFirst({
      where: { stockSymbol: "GLSCH" },
      orderBy: { time: "desc" },
    }),
    prisma.stockPrice.findFirst({
      where: { stockSymbol: "BNSAI" },
      orderBy: { time: "desc" },
    }),
    prisma.stockPrice.findFirst({
      where: { stockSymbol: "GLDN" },
      orderBy: { time: "desc" },
    }),
  ]);

  const lastPrices: Record<string, number> = {
    GLSCH: lastTradeGLSCH?.avgPrice ?? 5,
    BNSAI: lastTradeBNSAI?.avgPrice ?? 5,
    GLDN: lastTradeGLDN?.avgPrice ?? 5,
  };

  return (
    <div className="flex flex-col items-center min-h-screen position-relative p-4">
      <StockProvider>
        <Charts />
        <div className="mt-10 text-2xl text-center">
          <h1 className="text-4xl font-bold">{curUser.name}</h1>
        </div>
        <div className="mt-8 text-lg text-center border-2 border-border rounded-lg p-4 bg-light-bg">
          <p className="text-2xl mb-4 text-green">
            ₲{" "}
            <span className="font-martian">
              {" " + curUser.money.toFixed(2)}
            </span>
          </p>
          <p className="mb-1">Assets:</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {curUser.assets.length > 0 ? (
              curUser.assets.map((asset) => {
                const price = priceMap[asset.stockSymbol] ?? 5;
                const currentValue = price;
                const profit = currentValue - asset.boughtFor;
                return (
                  <div
                    key={asset.stockSymbol}
                    className={`border p-2 rounded-lg ${
                      profit > 0 ? "border-green-300" : "border-red"
                    }`}
                  >
                    <div className="flex gap-2">
                      <Image
                        src={`${
                          profit > 0 ? "/upArrow.svg" : "/downArrow.svg"
                        }`}
                        alt="arrow"
                        width={10}
                        height={10}
                        className="display-inline"
                      />
                      <p className="">
                        <span className="font-bold">{asset.stockSymbol}</span>:{" "}
                        {asset.quantity} Aktien
                      </p>
                    </div>
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
        <div className="mt-12 text-lg flex flex-col md:flex-row md:justify-center items-center gap-10 md:gap-4 md:items-start md:justify-between w-full max-w-2xl px-4">
          <AddOrderForm userId={curUser.id} lastPrices={lastPrices} />
          <OrderList userId={curUser.id} />
        </div>
      </StockProvider>

      <form className="mt-8" action={logout}>
        <input type="hidden" name="userId" value={curUser.id} />
        <button
          type="submit"
          className="border-2 border-primary-blue text-white rounded-lg p-2 px-4
         w-full hover:bg-primary-blue active:hover:bg-primary-blue cursor-pointer"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
