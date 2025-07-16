"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

export async function addOrder(formData: FormData) {
    const stockSymbol = formData.get("stockSymbol") as "GLSCH";
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const price = parseFloat(formData.get("price") as string);
    const type = formData.get("type") as "BUY" | "SELL";
    const userId = formData.get("userId") as string;
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