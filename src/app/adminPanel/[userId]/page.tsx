import React from "react";
import { prisma } from "../../../../lib/prisma";
import { redirect } from "next/navigation";
import BuyOrderList from "../_components/OrderList";
import AddOrder from "../_components/AddOrder";

async function deleteUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  await prisma.user.delete({
    where: { id: userId },
  });
  redirect("/adminPanel");
}
export default async function User({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const resolved = await params;
  const curUser = await prisma.user.findUnique({
    where: { id: resolved.userId },
    include: {
      assets: true,
    },
  });
  if (!curUser) {
    return <div>User not found</div>;
  }
  return (
    <div className="flex flex-col items-center min-h-screen position-relative">
      <form className="absolute top-4 right-4" action={deleteUser}>
        <input type="hidden" name="userId" value={curUser.id} />
        <button
          className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
          type="submit"
        >
          delete
        </button>
      </form>
      <div className="mt-16 text-2xl text-center">
        <h1 className="text-4xl">{curUser.name}</h1>
        <p className="text-lg">Money: ${curUser.money.toFixed(2)}</p>
      </div>
      <div className="mt-8 text-lg">
        <p className="mb-4">Assets:</p>
        <div className="flex items-center justify-center gap-4">
          {curUser.assets.map((asset) => (
            <div
              key={asset.stockSymbol}
              className="border p-2 rounded-lg bg-gray-100"
            >
              <p>
                {asset.stockSymbol}: {asset.quantity} shares
              </p>
              <p>Value: ${(asset.quantity * 5).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-lg flex justify-between w-full max-w-2xl px-4">
        <BuyOrderList userId={curUser.id} />
        <AddOrder userId={curUser.id} />
      </div>
    </div>
  );
}
