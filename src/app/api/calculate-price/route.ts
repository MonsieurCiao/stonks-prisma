import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


// function calculatePrice(  orders: { price: number; quantity: number; type: 'BUY' | 'SELL' }[], curPrice: number | null): number | null {
//   // 1. Calculate new price based on recent orders
//   // Your price calculation logic here (e.g., weighted average, last trade, etc.)
//   // if (orders.length === 0) return null;
//   // const total = orders.reduce((sum, order) => sum + order.price, 0);
//   // return total / orders.length;
//   if(curPrice === null) curPrice = 10;

//   //agents
//   for(let i = 0; i < 20; i++){
//     const action = Math.random() < 0.5 ? 'BUY' : 'SELL';
//     const priceChange = (action === 'BUY' ? 1 : -1) * curPrice * 0.01 ;
//     curPrice += priceChange;
//   }
//   return curPrice; 
// }
type Order = {
  price: number;
  quantity: number;
  createdAt: Date;
};

type Trade = {
  price: number;
  quantity: number;
  timestamp: Date;
};

type OHLC = {
  open: number;
  high: number;
  low: number;
  close: number;
};
function calculateOHLC(buyOrders: Order[], sellOrders: Order[]): OHLC | null {
  const matchedTrades: Trade[] = [];

  // Sort buy orders descending (highest price first), sell orders ascending
  const buys = [...buyOrders].sort((a, b) => b.price - a.price);
  const sells = [...sellOrders].sort((a, b) => a.price - b.price);

  let buyIndex = 0;
  let sellIndex = 0;

  while (buyIndex < buys.length && sellIndex < sells.length) {
    const buy = buys[buyIndex];
    const sell = sells[sellIndex];

    // Match condition
    if (buy.price >= sell.price) {
      const tradedQuantity = Math.min(buy.quantity, sell.quantity);
      const tradePrice = (buy.price + sell.price) / 2;

      matchedTrades.push({
        price: tradePrice,
        quantity: tradedQuantity,
        timestamp: new Date(),
      });

      // Decrement order quantities
      buy.quantity -= tradedQuantity;
      sell.quantity -= tradedQuantity;

      if (buy.quantity === 0) buyIndex++;
      if (sell.quantity === 0) sellIndex++;
    } else {
      // No more matches possible
      break;
    }
  }

  if (matchedTrades.length === 0) return null;

  const prices = matchedTrades.map(t => t.price);

  return {
    open: prices[0],
    high: Math.max(...prices),
    low: Math.min(...prices),
    close: prices[prices.length - 1],
  };
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
  

  // 2. Execute order book
  const buyOrders = orders.filter(o => o.type === 'BUY');
  const sellOrders = orders.filter(o => o.type === 'SELL');
  const ohlc = calculateOHLC(buyOrders, sellOrders);
  if (ohlc === null) {
    return NextResponse.json({ message: "No orders" }, { status: 200 });
  }

  // 3. Store new price in DB
  await prisma.stockPrice.create({
    data: {
      stockSymbol: "GLSCH", 
      high: ohlc.high,
      low: ohlc.low,
      open: ohlc.open,
      close: ohlc.close,
    },
  });

  return NextResponse.json({ success: true, ohlc });
}
