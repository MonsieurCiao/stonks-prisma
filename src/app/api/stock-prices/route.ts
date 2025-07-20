
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if(!symbol){
    return new Response("Missing symbol", {status: 400});
  }

  const prices = await prisma.stockPrice.findMany({
    where: {
      stockSymbol: symbol,
    },
    orderBy: {
      time: "desc",
    },
    take: 50, 
  });

  const reversedPrices = prices.slice().reverse();

  // Format to [{ time, price }]
  const formatted = reversedPrices.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: Math.round(p.avgPrice*100)/100,
  }));


  return NextResponse.json(formatted);
}