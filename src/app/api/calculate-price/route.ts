import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


function calculatePrice(  orders: { price: number; quantity: number; type: 'BUY' | 'SELL' }[], curPrice: number | null): number | null {
  // 1. Calculate new price based on recent orders
  // Your price calculation logic here (e.g., weighted average, last trade, etc.)
  // if (orders.length === 0) return null;
  // const total = orders.reduce((sum, order) => sum + order.price, 0);
  // return total / orders.length;
  if(curPrice === null) curPrice = 10;

  //agents
  for(let i = 0; i < 20; i++){
    const action = Math.random() < 0.5 ? 'BUY' : 'SELL';
    const priceChange = (action === 'BUY' ? 1 : -1) * curPrice * 0.01 ;
    curPrice += priceChange;
  }
  return curPrice; 
}

export async function GET() {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  const orders = await prisma.order.findMany({
    where: {
      stockSymbol: "GLSCH",
      createdAt: {
        gte: oneMinuteAgo,
      },
    },
  });
  const curPrice = await prisma.stockPrice.findFirst({
    where: {
      stockSymbol: "GLSCH",
    },
    orderBy: {
      time: "desc",
    },
  });

  // 2. Calculate new price
  const newPrice = calculatePrice(orders, curPrice ? curPrice.price : null);
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
