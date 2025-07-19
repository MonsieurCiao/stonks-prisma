import { cancelOrder } from "@/actions/actions";
import React from "react";

export default function CancelOrderButton({
  id,
  userId,
  type,
}: {
  id: string;
  userId: string;
  type: "BUY" | "SELL";
}) {
  return (
    <form action={cancelOrder} className="absolute top-0 right-0 bottom-0">
      <input type="hidden" name="orderId" value={id} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="type" value={type} />
      <button className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-200 cursor-pointer ">
        C
      </button>
    </form>
  );
}
