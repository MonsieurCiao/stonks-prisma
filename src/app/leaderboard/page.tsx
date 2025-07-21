import React from "react";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";
import { stocks } from "../../../lib/constants";

export default async function Leaderboard() {
  const users = await prisma.user.findMany({
    include: {
      assets: true,
    },
  });
  const cookieStorage = await cookies();
  const userId = cookieStorage.get("userId")?.value;

  if (users.length === 0) {
    return (
      <div className="w-full flex h-100 justify-center items-center">
        <p className="text-center text-xl">no users found</p>
      </div>
    );
  }

  const curPrices: Record<string, number> = {};
  await Promise.all(
    stocks.map(async (stock) => {
      const price = await prisma.stockPrice.findFirst({
        where: { stockSymbol: stock },
        orderBy: { time: "desc" },
      });
      curPrices[stock] = price?.avgPrice ?? 5;
    })
  );

  const usersWithAssetVal = users.map((user) => {
    let assetValue = 0;
    user.assets.map((asset) => {
      assetValue += asset.quantity * curPrices[asset.stockSymbol];
    });
    return {
      ...user,
      assetValue: assetValue,
    };
  });
  const sortedUsers = usersWithAssetVal.toSorted((a, b) => {
    return b.money + b.assetValue - (a.money + a.assetValue);
  });

  return (
    <div className="flex flex-col justify-center mt-8 w-full items-center px-4">
      <h1 className="text-4xl mb-8">Leaderboard</h1>
      <ul className="w-min flex flex-col gap-4">
        {sortedUsers.map((user, i) => (
          <li
            key={user.id}
            className={`border-2 ${
              user.id === userId ? "border-green" : "border-border"
            } rounded-lg w-full px-8 py-2 `}
          >
            <div className="flex justify-between text-2xl gap-4">
              <span className="">{i + 1}</span> <span>{user.name}</span>{" "}
              <span className="text-green">
                {(user.money + user.assetValue).toFixed(2)}
              </span>
            </div>
            <div className="text-md w-full flex justify-center text-center">
              ₲: {user.money.toFixed(2)} | Asset-Wert:{" "}
              {user.assetValue.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
