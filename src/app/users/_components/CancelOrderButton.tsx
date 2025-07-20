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
    <form action={cancelOrder} className="">
      <input type="hidden" name="orderId" value={id} />
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="type" value={type} />
      <button className="p-1 bg-border  rounded-lg hover:bg-red cursor-pointer w-full ">
        Auftrag stornieren
      </button>
    </form>
  );
}
