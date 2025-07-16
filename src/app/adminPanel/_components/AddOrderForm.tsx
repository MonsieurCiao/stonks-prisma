import { addOrder } from "@/actions/actions";
import React from "react";

export default function AddOrderForm({
  userId,
  lastPrice,
}: {
  userId: string;
  lastPrice: number;
}) {
  const [type, setType] = React.useState<"BUY" | "SELL">("BUY");
  const recommendedPrice =
    type === "BUY"
      ? Math.round((lastPrice + lastPrice * 0.03) * 100) / 100
      : Math.round((lastPrice - lastPrice * 0.03) * 100) / 100;
  return (
    <div>
      <form
        className="flex flex-col items-center mt-8 w-xs max-w-md"
        action={addOrder}
      >
        <input type="hidden" name="userId" value={userId} />
        <select
          name="stockSymbol"
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        >
          <option value="GLSCH">GLSCH</option>
        </select>
        <select
          name="type"
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          onChange={(e) => setType(e.target.value as "BUY" | "SELL")}
        >
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <label className="mb-2">
          Wir empfehlen einen{" "}
          {type === "BUY"
            ? `Kaufpreis von ${recommendedPrice}`
            : `Verkaufspreis von ${recommendedPrice}`}{" "}
        </label>
        <input
          type="number"
          name="price"
          defaultValue={lastPrice}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg p-2
         w-full hover:bg-blue-600"
        >
          Add Order
        </button>
      </form>
    </div>
  );
}
