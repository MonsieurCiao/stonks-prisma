"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

export async function addOrder(prevState: {message:string | null}, formData: FormData): Promise<{message:string | null}> {
  const stockSymbol = formData.get("stockSymbol") as "GLSCH";
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const price = parseFloat(formData.get("price") as string);
  const type = formData.get("type") as "BUY" | "SELL";
  const userId = formData.get("userId") as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return{ message: "User not found"};
  }

  if(type=== "SELL"){
    const asset = await prisma.asset.findFirst({
      where: {
        userId: userId,
        stockSymbol: stockSymbol,
      }
    });
    if (!asset) return {message: "Asset not found"};
    const assetAmount = asset.quantity;

    if (quantity > assetAmount) {
      return {message: "Not enough stock quantity"};
    }
    await prisma.asset.update({
      where: {
        userId: userId,
        stockSymbol: stockSymbol,
      },
      data: {
        quantity: { decrement: quantity },
      },
    });
  }
  if(type==="BUY"){
    const totalPrice = quantity * price;
    if (user.money < totalPrice) {
      return {message: "Not enough money"};
    }

    await prisma.user.update({
      where:{
        id: userId,
      },
      data: {
        money:{ decrement: totalPrice},
      }
    });
  }

  await prisma.order.create({
    data: {
      stockSymbol,
      quantity,//fis //jee //nero //nip //monet 
      price, //git (lab) /react
      type,
      userId,
    },
  });
  revalidatePath(`/adminPanel/${userId}`);
  return {message:"success"}
}
export async function deleteUser(formData: FormData) {
  "use server";
  const userId = formData.get("userId") as string;
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/adminPanel");
}
export async function cancelOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const userId = formData.get("userId") as string;
  // const tradedQuantity = parseFloat(formData.get("tradedQuantity") as string);
  const type = formData.get("type") as "BUY" | "SELL";

  if (!orderId || !userId || !type) {
    throw new Error("Missing required fields");
  }
  const order = await prisma.order.findUnique({
    where: {id: orderId, userId: userId},
  })
  if(!order) throw new Error("Order not found");
  //giveback money
  if(type=== "BUY") {
    await prisma.user.update({
      where: {id: userId},
      data: {
        money: {increment: order.price * order.quantity},
      },
    });
  }else{
    //give back asset
    await prisma.asset.upsert({
      where: {
        userId: userId,
        stockSymbol: order.stockSymbol,
      },
      update: {
        quantity: { increment: order.quantity },
      },
      create: {
        userId: userId,
        stockSymbol: order.stockSymbol,
        quantity: order.quantity,
      },
    });
  }
  //delete order
  await prisma.order.delete({
    where:{id: orderId, userId: userId}
  })

  // await deleteOrder(orderId, userId, tradedQuantity, type);
  revalidatePath(`/adminPanel/${userId}`);
}