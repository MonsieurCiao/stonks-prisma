"use client";
import React from "react";
import CancelOrderButton from "./CancelOrderButton";

export default function OrderListItem({
  order,
  userId,
}: {
  userId: string;
  order: {
    id: string;
    stockSymbol: string;
    quantity: number;
    price: number;
    type: "BUY" | "SELL";
  };
}) {
  const [showCancel, setShowCancel] = React.useState(false);
  return (
    <li
      className={`border ${
        order.type === "SELL" ? "border-red-300" : "border-green-300"
      } rounded-lg mb-2 p-2 relative`}
      onMouseEnter={() => setShowCancel(true)}
      onMouseLeave={() => setShowCancel(false)}
    >
      <span className="font-bold">{order.stockSymbol}</span> - {order.quantity}{" "}
      shares at ${order.price.toFixed(2)} each
      <div className={`${showCancel ? "" : "hidden"}`}>
        <CancelOrderButton id={order.id} userId={userId} type={order.type} />
      </div>
    </li>
  );
}
