import React from "react";
import { prisma } from "../../../../lib/prisma";
import AddOrder from "../_components/AddOrder";
import OrderList from "../_components/OrderList";
import Charts from "../_components/Charts";

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
  const curPrice = await prisma.stockPrice.findFirst({
    where: { stockSymbol: "GLSCH" },
    orderBy: { time: "desc" },
  });
  if (!curUser) {
    return <div>User not found</div>;
  }
  return (
    <div className="flex flex-col items-center min-h-screen position-relative p-4">
      <Charts />
      <div className="mt-10 text-2xl text-center">
        <h1 className="text-4xl">{curUser.name}</h1>
      </div>
      <div className="mt-8 text-lg text-center border-2 border-border rounded-lg px-8 py-4">
        <p className="text-2xl mb-4">{curUser.money.toFixed(2)}</p>
        <p className="mb-1">Assets:</p>
        <div className="flex items-center justify-center gap-4">
          {curUser && curUser.assets.length !== 0 ? (
            curUser.assets.map((asset) => (
              <div
                key={asset.stockSymbol}
                className={`border border-border p-2 rounded-lg ${
                  curPrice &&
                  asset.quantity * curPrice.avgPrice - asset.boughtFor > 0
                    ? "border-green-300"
                    : "border-gray-300"
                }`}
              >
                <p>
                  {asset.stockSymbol}: {asset.quantity} shares
                </p>
                <p>Bought for: ${asset.boughtFor.toFixed(2)}</p>
                <p>
                  Value: $
                  {curPrice && (asset.quantity * curPrice.avgPrice).toFixed(2)}
                </p>
              </div>
            ))
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
