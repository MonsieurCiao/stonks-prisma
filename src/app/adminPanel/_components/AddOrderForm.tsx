"use client";
import { addOrder } from "@/actions/actions";
import React from "react";
import { useFormState } from "react-dom";

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
      ? lastPrice + lastPrice * 0.03
      : lastPrice - lastPrice * 0.03;

  const [form, formAction] = useFormState(addOrder, {
    message: null,
  });
  return (
    <div>
      <form
        className="flex flex-col items-center mt-8 w-xs max-w-md"
        action={formAction}
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
          step={0.01}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
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
          defaultValue={recommendedPrice}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
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
          className="bg-blue-500 text-white rounded-lg p-2
         w-full hover:bg-blue-600"
        >
          Add Order
        </button>
      </form>
    </div>
  );
}
