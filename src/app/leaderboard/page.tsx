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
  await stocks.map(async (stock) => {
    const price = await prisma.stockPrice.findFirst({
      where: { stockSymbol: stock },
      orderBy: { time: "desc" },
    });
    curPrices[stock] = price?.avgPrice ?? 5;
  });

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
    return a.money + a.assetValue - (b.money + b.assetValue);
  });

  return (
    <div className="flex flex-col justify-center mt-8 w-full items-center">
      <h1 className="text-4xl mb-8">Leaderboard</h1>
      <ul className="w-min">
        {sortedUsers.map((user, i) => (
          <li
            key={user.id}
            className={`border-2 ${
              user.id === userId ? "border-green" : "border-border"
            } rounded-lg w-full px-12 py-2 `}
          >
            <div className="flex justify-center gap-10 text-2xl ">
              <span className="">{i + 1}</span> <span>{user.name}</span>{" "}
              <span className="text-green">{user.money + user.assetValue}</span>
            </div>
            <div className="text-md w-max">
              GCoins: {user.money} | Asset-Wert: {user.assetValue}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
