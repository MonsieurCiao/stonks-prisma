import React from "react";
import { prisma } from "../../../../lib/prisma";

export default async function OrderList({ userId }: { userId: string }) {
  const buyOrders = await prisma.order.findMany({
    where: {
      userId: userId,
      // type: "BUY",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex flex-col items-center mt-8 w-xs max-w-md">
      <h2 className="text-2xl mb-4">Orders</h2>
      <ul className="list-none rounded-lg p-3">
        {buyOrders.map((order) => (
          <li
            key={order.id}
            className={`border ${
              order.type === "SELL" ? "border-red-300" : "border-green-300"
            } rounded-lg mb-2 p-2`}
          >
            <span className="font-bold">{order.stockSymbol}</span> -{" "}
            {order.quantity} shares at ${order.price.toFixed(2)} each
          </li>
        ))}
      </ul>
    </div>
  );
}
