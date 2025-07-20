import React from "react";
import { prisma } from "../../../../lib/prisma";
import OrderListItem from "./OrderListItem";

export default async function OrderList({ userId }: { userId: string }) {
  const buyOrders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex flex-col items-center justify-start w-xs max-w-md">
      <h2 className="text-2xl mb-4 text-center">Ausstehende Aufträge</h2>
      {buyOrders.length !== 0 ? (
        <ul className="list-none rounded-lg p-3">
          {buyOrders.map((order) => (
            <OrderListItem order={order} userId={userId} key={order.id} />
          ))}
        </ul>
      ) : (
        <p>- keine ausstehenden Aufträge -</p>
      )}
    </div>
  );
}
