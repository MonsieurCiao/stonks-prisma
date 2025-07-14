import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


function calculatePrice() {
  // Your price calculation logic here (e.g., weighted average, last trade, etc.)
  // if (orders.length === 0) return null;
  // const total = orders.reduce((sum, order) => sum + order.price, 0);
  // return total / orders.length;
  return Math.random() * 1000; 
}

export async function GET() {
  // 1. Fetch relevant orders (e.g., all open orders or last 30 seconds)
  // const orders = await prisma.order.findMany({
  //   // Add filtering as needed
  // });

  // 2. Calculate new price
  const newPrice = calculatePrice();
  if (newPrice === null) {
    return NextResponse.json({ message: "No orders" }, { status: 200 });
  }

  // 3. Store new price in DB
  await prisma.stockPrice.create({
    data: {
      stockSymbol: "GLSCH", 
      price: newPrice,
    },
  });

  return NextResponse.json({ success: true, price: newPrice });
}
