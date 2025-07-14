import { revalidatePath } from "next/cache";
import React from "react";
import { prisma } from "../../../../lib/prisma";

export default function AddOrder({ userId }: { userId: string }) {
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
    // Revalidate the path to update the UI
    revalidatePath(`/adminPanel/${userId}`);
  }
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
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      />
      <select
        name="type"
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      >
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
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
