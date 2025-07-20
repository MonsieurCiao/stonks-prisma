"use client";
import { addOrder } from "@/actions/actions";
import React, { useActionState } from "react";
import { stocks } from "../../../../lib/constants";

export default function AddOrderForm({
  userId,
  lastPrices,
}: {
  userId: string;
  lastPrices: Record<string, number>;
}) {
  const [type, setType] = React.useState<"BUY" | "SELL">("BUY");
  const [stock, setStock] = React.useState<"GLSCH" | "BNSAI" | "GLDN">("GLSCH");

  const lastPrice = lastPrices[stock];
  const recommendedPrice =
    type === "BUY"
      ? lastPrice + lastPrice * 0.01
      : lastPrice - lastPrice * 0.01;

  const [form, formAction] = useActionState(addOrder, {
    message: null,
  });
  return (
    <div>
      <form
        className="flex flex-col items-center w-xs max-w-md"
        action={formAction}
      >
        <input type="hidden" name="userId" value={userId} />
        <select
          name="stockSymbol"
          className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
          onChange={(e) =>
            setStock(e.target.value as "GLSCH" | "BNSAI" | "GLDN")
          }
        >
          {stocks.map((stock) => (
            <option key={stock} value={stock}>
              {stock}
            </option>
          ))}
        </select>
        <select
          name="type"
          className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
          onChange={(e) => setType(e.target.value as "BUY" | "SELL")}
        >
          <option value="BUY">Buy</option>
          <option value="SELL">Sell</option>
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          step={0.01}
          className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
        />
        <label className="mb-2">
          Wir empfehlen einen{" "}
          {type === "BUY"
            ? `Kaufpreis von ${Math.round(recommendedPrice * 100) / 100}`
            : `Verkaufspreis von ${
                Math.round(recommendedPrice * 100) / 100
              }`}{" "}
        </label>
        <input
          step={0.01}
          type="number"
          name="price"
          defaultValue={Math.round(recommendedPrice * 100) / 100}
          className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
        />
        {form.message && (
          <p
            className={`mb-4 px-4 rounded text-sm ${
              form.message.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {form.message}
          </p>
        )}
        <button
          type="submit"
          className="bg-secondary-blue text-white rounded-lg p-2
         w-full hover:bg-primary-blue cursor-pointer"
        >
          Add Order
        </button>
      </form>
    </div>
  );
}
