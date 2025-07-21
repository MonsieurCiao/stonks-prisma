"use server";
import React from "react";
import { stocks } from "../../../../lib/constants";
import { addPost } from "@/actions/actions";
import { prisma } from "../../../../lib/prisma";

export default async function AddNews() {
  const curPrices: Record<string, number> = {};
  await Promise.all(
    stocks.map(async (stock) => {
      const price = await prisma.stockPrice.findFirst({
        where: { stockSymbol: stock },
        orderBy: { time: "desc" },
      });
      curPrices[stock] = price?.avgPrice ?? 5;
    })
  );
  let curInfluences: number[] = [];
  await Promise.all(
    stocks.map(async (_, i) => {
      const influence = await prisma.priceInfluence.findFirst({
        orderBy: {
          time: "desc",
        },
      });
      curInfluences[i] = influence ? influence.influence[i] : 0.5;
    })
  );
  return (
    <form className="flex flex-col items-center w-xs max-w-md" action={addPost}>
      <h2 className="text-2xl mb-4">Post News</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <textarea
        name="content"
        placeholder="Content"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <p className="text-border text-center">Influences</p>
      <div className="flex gap-4">
        {stocks.map((stock, i) => (
          <div key={stock} className="flex flex-col items-center">
            <label className="text-white">{stock}</label>
            <input
              type="number"
              name={stock}
              placeholder={stock}
              step={0.01}
              defaultValue={curInfluences[i]}
              className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-secondary-blue rounded-lg p-2 w-full hover:bg-primary-blue transition-colors duration-200 cursor-pointer"
      >
        Post
      </button>
    </form>
  );
}
