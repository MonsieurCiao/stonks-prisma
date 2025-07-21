"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

export async function addOrder(prevState: {message:string | null}, formData: FormData): Promise<{message:string | null}> {
  const stockSymbol = formData.get("stockSymbol") as "GLSCH";
  const quantity = parseFloat(formData.get("quantity") as string);
  const price = parseFloat(formData.get("price") as string);
  const type = formData.get("type") as "BUY" | "SELL";
  const userId = formData.get("userId") as string;
  if (price < 0.01 || quantity < 0.01) return {message: "kauf mehr oder zahl mehr"}
  if (isNaN(quantity) || isNaN(price)) {
    return { message: "Ungültiger Preis oder Menge" };
  }
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
    const updatedAsset = await prisma.asset.update({
      where: {
        stockSymbol_userId:{
          userId: userId,
          stockSymbol: stockSymbol,
        }
      },
      data: {
        quantity: { decrement: quantity },
      },
    });
    if(updatedAsset.quantity === 0){
      await prisma.asset.delete({
        where: {
          stockSymbol_userId:{
            userId: userId,
            stockSymbol: stockSymbol
          }
        }
      })
    }
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
        stockSymbol_userId:{
          userId: userId,
          stockSymbol: order.stockSymbol,
        }
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

export async function createUser(formData: FormData) {
  "use server";
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  revalidatePath("/adminPanel");
}

export async function addPost(formData: FormData){
  "use server";
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const GLSCH = parseFloat(formData.get("GLSCH") as string);
  const BNSAI = parseFloat(formData.get("BNSAI") as string);
  const GLDN = parseFloat(formData.get("GLDN") as string);
  await prisma.newsPost.create({
    data: {
      title,
      content,
    },
  });
  await prisma.priceInfluence.create({
    data:{
      influence: [GLSCH, BNSAI, GLDN]
    }
  })
  revalidatePath("/adminPanel");
}
export async function deleteAllPrices(prevState: {message:string | null},formData: FormData): Promise<{message: string | null}>{
  "use server"
  const password = formData.get("password") as string;
  if(password!== "zebrastreifen") return {message: "invalid key"};
  
  try{
  await prisma.stockPrice.deleteMany();
  }catch{
    {message: "failed"}
  }

  return {message: "success"}
}
export async function deleteUser(prevState: {message:string | null},formData: FormData): Promise<{message: string | null}>{
  "use server"
  const userId = formData.get("userId") as string;
  
  try{
    await prisma.user.delete({
      where: {id: userId}
    });
  }catch{
    return {message: "user not found"}
  }
  revalidatePath('/adminPanel');
  return {message: "success"}
}
export async function modifyMoney(prevState: {message:string | null},formData: FormData): Promise<{message: string | null}>{
  "use server"
  const userId = formData.get("userId") as string;
  const money = parseFloat(formData.get("money") as string);
  
  try{
    await prisma.user.update({
      where: {id: userId},
      data:{
        money: {increment: money}
      }
    });
  }catch{
    return {message: "something went wrong"}
  }
  revalidatePath('/adminPanel');
  return {message: "success"}
}