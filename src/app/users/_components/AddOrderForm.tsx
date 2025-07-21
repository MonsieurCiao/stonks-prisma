"use client";
import { addOrder } from "@/actions/actions";
import React, { useActionState } from "react";
import { stocks, StockSymbol } from "../../../../lib/constants";
import { useStock } from "./selectedStockContext";

export default function AddOrderForm({
  userId,
  lastPrices,
}: {
  userId: string;
  lastPrices: Record<string, number>;
}) {
  const [type, setType] = React.useState<"BUY" | "SELL">("BUY");
  const { stock, setStock } = useStock();

  const lastPrice = lastPrices[stock];
  const recommendedPrice =
    type === "BUY"
      ? lastPrice + lastPrice * 0.01
      : lastPrice - lastPrice * 0.01;

  const [price, setPrice] = React.useState<number>(
    Math.round(recommendedPrice) / 100
  );
  React.useEffect(() => {
    setPrice(Math.round(recommendedPrice * 100) / 100);
  }, [recommendedPrice]);

  const [form, formAction] = useActionState(addOrder, {
    message: null,
  });
  return (
    <div className="bg-light-bg p-4 rounded-lg">
      <h2 className="mb-2 text-2xl">Auftrag hinzufügen</h2>
      <form
        className="flex flex-col items-center w-xs max-w-md"
        action={formAction}
      >
        <input type="hidden" name="userId" value={userId} />
        <select
          name="stockSymbol"
          className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
          onChange={(e) => setStock(e.target.value as StockSymbol)}
          value={stock}
        >
          {stocks.map((_stock) => (
            <option key={_stock} value={_stock}>
              {_stock}
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
          placeholder="Stock Anzahl"
          min={0}
          step={0.01}
          className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
        />
        <label className="mb-2">
          Wir empfehlen einen{" "}
          {type === "BUY"
            ? `Kaufpreis von ${Math.round(recommendedPrice * 100) / 100}`
            : `Verkaufspreis von ${Math.round(recommendedPrice * 100) / 100}`}
          ₲{" "}
        </label>
        <input
          step={0.01}
          type="number"
          name="price"
          min={0}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0.01)}
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
          className="bg-primary-blue text-white rounded-lg p-2
         w-full hover:bg-secondary-blue cursor-pointer"
        >
          Add Order
        </button>
      </form>
    </div>
  );
}
