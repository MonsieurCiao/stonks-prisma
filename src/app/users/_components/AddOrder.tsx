"use server";
import React from "react";
import { prisma } from "../../../../lib/prisma";
import AddOrderForm from "./AddOrderForm";
import { StockSymbol } from "../../../../lib/constants";

export default async function AddOrder({
  userId,
  sharedStock,
  setSharedStock,
}: {
  userId: string;
  sharedStock: StockSymbol;
  setSharedStock: React.Dispatch<React.SetStateAction<StockSymbol>>;
}) {
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
    <AddOrderForm
      userId={userId}
      lastPrices={lastPrices}
      sharedStock={sharedStock}
      setSharedStock={setSharedStock}
    />
  );
}
