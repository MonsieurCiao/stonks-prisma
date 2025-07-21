import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { stocks } from "../../../../lib/constants";
import { revalidatePath } from "next/cache";

// THIS IS BASICALLY THE ORDER BOOK

type Order = {
  price: number;
  quantity: number;
  userId: string;
  id: string;
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
async function updateOrder(orderId: string, userId: string, tradedQuantity: number, tradePrice: number, type: "BUY" | "SELL", deleteOrder: boolean, stockSymbol: string) {
  if (deleteOrder) {
    await prisma.order.delete({
      where: {
        id: orderId,
        userId: userId,
      },
    });
  }
  else{
    await prisma.order.update({
      where: {
        id: orderId,
        userId: userId,
      },
      data: {
        quantity: { decrement: tradedQuantity },
      },
    });
  }
  // NOTICE that the updating of money and assets should be done in the addOrder function
  // this is where the money and assets are transferred

  //give user asset if he bought
  if(type === "BUY" && userId !== "1") {
    try{
      await prisma.asset.upsert({
        where: {
          // userId: userId,
          // stockSymbol: stockSymbol,
          stockSymbol_userId:{
            stockSymbol: stockSymbol,
            userId: userId
          }
        },
        update: {
          quantity: { increment: tradedQuantity },
          boughtFor: {increment: tradePrice * tradedQuantity}
        },
        create: {
          stockSymbol: stockSymbol,
          quantity: tradedQuantity,
          userId: userId,
          boughtFor: tradePrice * tradedQuantity
        },
      });
    }catch(err){
      console.error("Failed upsert", { userId, stockSymbol, err })
    }
  }
  //give user money if he sold
  else if(type === "SELL") {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        money: { increment: tradePrice* tradedQuantity },
      },
    });
  }
  revalidatePath(`/users/${userId}`)
}
function generateOrders(count: number, lastAvgPrice: number, influence: number): Order[] {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    orders.push({
      price: lastAvgPrice + lastAvgPrice * (Math.random() * 2 -1) * 0.05, //last avg price +- 0%<->5%
      type: Math.random() > influence ? "BUY" : "SELL", 
      quantity: Math.floor(Math.random() * 5) + 1, // quantity between 1 and 5
      userId: "1", //indicates bot
      id: crypto.randomUUID(),
    });
  }
  return orders;
}
async function calculateOHLC(buyOrders: Order[], sellOrders: Order[], lastAvgPrice: number, stockSymbol:string, influence: number): Promise<OHLC | null> {
  const generatedOrders = generateOrders(100, lastAvgPrice, influence);
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

      //update orders
      if (buy.quantity === 0 && buy.userId !== "1") {
        await updateOrder(buy.id, buy.userId, tradedQuantity, tradePrice, 'BUY', true, stockSymbol);
      } else if( buy.quantity > 0 && buy.userId !== "1") {
        await updateOrder(buy.id, buy.userId, tradedQuantity, tradePrice, 'BUY', false, stockSymbol);
      }
      if (sell.quantity === 0 && sell.userId !== "1") {
        await updateOrder(sell.id, sell.userId, tradedQuantity, tradePrice, 'SELL', true, stockSymbol);
      } else if( sell.quantity > 0 && sell.userId !== "1") {
        await updateOrder(sell.id, sell.userId, tradedQuantity, tradePrice, 'SELL', false, stockSymbol);
      }

      if (buy.quantity === 0) buyIndex++;
      if (sell.quantity === 0) sellIndex++;
    } else {
      // No more matches possible
      break;
    }
  }

  if (matchedTrades.length === 0) return null;

  const prices = matchedTrades.map(t => Math.round(t.price *100) / 100); //round to 2 decimal places

  return {
    open: prices[0],
    high: Math.max(...prices),
    low: Math.min(...prices),
    close: prices[prices.length - 1],
  };
}

export async function GET() {
  // Fetch orders for each stock
  const allOrders = await Promise.all(
    stocks.map(async (stock) => {
      const stockOrders = await prisma.order.findMany({
        where: { stockSymbol: stock },
      });
      return [stock, stockOrders] as const;
    })
  );

  // Convert array of [stock, orders] into a Record<string, Order[]>
  const ordersByStock: Record<string, Order[]> = Object.fromEntries(allOrders);
  let i = 0;
  for (const stock of stocks) {
    const stockOrders = ordersByStock[stock] || [];

    const buyOrders = stockOrders.filter(o => o.type === 'BUY');
    const sellOrders = stockOrders.filter(o => o.type === 'SELL');

    const lastStockTrade = await prisma.stockPrice.findFirst({
      where: { stockSymbol: stock },
      orderBy: { time: "desc" },
      take: 1,
    });

    let lastAvgPrice = 0;
    switch(stock){
      case stocks[0]: 
      lastAvgPrice = lastStockTrade?.avgPrice ?? 1000;
      break;
      case stocks[1]: 
      lastAvgPrice = lastStockTrade?.avgPrice ?? 200;
      break;
      case stocks[2]: 
      lastAvgPrice = lastStockTrade?.avgPrice ?? 5000;
      break;
    }
    const influences = await prisma.priceInfluence.findFirst({
      orderBy: {time: "desc"},
      take: 1
    });
    const influence = influences?.influence[i]?? 0.5;
    
    

    const ohlc = await calculateOHLC(buyOrders, sellOrders, lastAvgPrice, stock, influence);

    if (!ohlc) {
      const lastStockPrice = await prisma.stockPrice.findFirst({
        where: { stockSymbol: stock },
        orderBy: { time: "desc" },
        take: 1,
      });

      const lastOHLC = {
        open: lastStockPrice?.open || 0,
        high: lastStockPrice?.high || 0,
        low: lastStockPrice?.low || 0,
        close: lastStockPrice?.close || 0,
      };

      await prisma.stockPrice.create({
        data: {
          stockSymbol: stock,
          high: lastOHLC.high,
          low: lastOHLC.low,
          open: lastOHLC.open,
          close: lastOHLC.close,
          avgPrice: (lastOHLC.open + lastOHLC.close) / 2,
        },
      });

      continue; // skip to next stock
    }

    // Store new OHLC in DB
    await prisma.stockPrice.create({
      data: {
        stockSymbol: stock,
        high: ohlc.high,
        low: ohlc.low,
        open: ohlc.open,
        close: ohlc.close,
        avgPrice: (ohlc.open + ohlc.close) / 2,
      },
    });
    i++;
  }
  return NextResponse.json({ success: true });
}
