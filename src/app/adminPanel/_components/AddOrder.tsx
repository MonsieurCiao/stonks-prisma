import { revalidatePath } from "next/cache";
import React from "react";
import { prisma } from "../../../../lib/prisma";

export default async function AddOrder({ userId }: { userId: string }) {
  const typeSelect = React.useRef<HTMLSelectElement>(null);
  async function addOrder(formData: FormData) {
    "use server";
    const stockSymbol = formData.get("stockSymbol") as "GLSCH";
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const price = parseFloat(formData.get("price") as string);
    const type = formData.get("type") as "BUY" | "SELL";
    await prisma.order.create({
      data: {
        stockSymbol,
        quantity,
        price,
        type,
        userId,
      },
    });
    revalidatePath(`/adminPanel/${userId}`);
  }
  const lastTrade = await prisma.stockPrice.findFirst({
    where: { stockSymbol: "GLSCH" },
    orderBy: { time: "desc" },
    take: 1,
  });
  const lastPrice = lastTrade ? lastTrade.avgPrice : 5;

  return (
    <form
      className="flex flex-col items-center mt-8 w-xs max-w-md"
      action={addOrder}
    >
      <select
        name="stockSymbol"
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      >
        <option value="GLSCH">GLSCH</option>
      </select>
      <select
        name="type"
        ref={typeSelect}
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
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
        {typeSelect.current?.value === "BUY"
          ? `Kaufpreis von ${
              Math.round((lastPrice + lastPrice * 0.03) * 100) / 100
            }`
          : `Verkaufspreis von ${
              Math.round((lastPrice - lastPrice * 0.03) * 100) / 100
            }`}{" "}
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
  );
}
