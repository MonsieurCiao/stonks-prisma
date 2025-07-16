import React from "react";
import { prisma } from "../../../../lib/prisma";
import AddOrderForm from "./AddOrderForm";

export default async function AddOrder({ userId }: { userId: string }) {
  const lastTrade = await prisma.stockPrice.findFirst({
    where: { stockSymbol: "GLSCH" },
    orderBy: { time: "desc" },
    take: 1,
  });
  const lastPrice = lastTrade ? lastTrade.avgPrice : 5;

  return <AddOrderForm userId={userId} lastPrice={lastPrice} />;
}
