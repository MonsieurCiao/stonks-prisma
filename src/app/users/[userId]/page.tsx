import React from "react";
import { prisma } from "../../../../lib/prisma";
import AddOrder from "../_components/AddOrder";
import OrderList from "../_components/OrderList";
import Charts from "../_components/Charts";
import PageContainer from "../_components/PageContainer";

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

  return <PageContainer curUser={curUser} priceMap={priceMap} />;
}
