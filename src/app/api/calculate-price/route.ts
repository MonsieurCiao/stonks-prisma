import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Order = {
  price: number;
  quantity: number;
  type: "BUY" | "SELL"; 
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
function generateOrders(count: number, lastAvgPrice: number): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    orders.push({
      price: lastAvgPrice + lastAvgPrice * (Math.random() * 2 -1) * 0.05, //last avg price +- 0%<->5%
      type: Math.random() > 0.5 ? "BUY" : "SELL", 
      quantity: Math.floor(Math.random() * 5) + 1, // quantity between 1 and 5
    });
  }
  return orders;
}
function calculateOHLC(buyOrders: Order[], sellOrders: Order[], lastAvgPrice: number): OHLC | null {
  const generatedOrders = generateOrders(10, lastAvgPrice);
  buyOrders = [...buyOrders, ...generatedOrders.filter(o => o.type === 'BUY')];
  sellOrders = [...sellOrders, ...generatedOrders.filter(o => o.type === 'SELL')];

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

  //round all these prices to 2 decimal places
  for (let i = 0; i < prices.length; i++) {
    prices[i] = Math.round(prices[i] * 100) / 100;
  }
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
  const lastStockTrade = await prisma.stockPrice.findFirst({
    where: { stockSymbol: "GLSCH" },
    orderBy: { time: "desc" },
    take: 1,
  });
  const lastAvgPrice = lastStockTrade !== null ? lastStockTrade.avgPrice : 5;
  

  // 2. Execute order book
  const buyOrders = orders.filter(o => o.type === 'BUY');
  const sellOrders = orders.filter(o => o.type === 'SELL');
  const ohlc = calculateOHLC(buyOrders, sellOrders, lastAvgPrice);
  if (ohlc === null) {
    const lastStockPrice = await prisma.stockPrice.findFirst({
      where: { stockSymbol: "GLSCH" },
      orderBy: { time: "desc" },
      take: 1,
    });
    const lastOHLC ={
      open: lastStockPrice?.open || 0,
      high: lastStockPrice?.high || 0,
      low: lastStockPrice?.low || 0,
      close: lastStockPrice?.close || 0,
    }
    return NextResponse.json({ success: true, lastOHLC });
  }

  // 3. Store new price in DB
  await prisma.stockPrice.create({
    data: {
      stockSymbol: "GLSCH", 
      high: ohlc.high,
      low: ohlc.low,
      open: ohlc.open,
      close: ohlc.close,
      avgPrice: (ohlc.open + ohlc.high + ohlc.low + ohlc.close) / 4,
    },
  });

  return NextResponse.json({ success: true, ohlc });
}
