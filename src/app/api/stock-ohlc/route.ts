import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if(!symbol){
    return new Response("Missing symbol", {status:400});
  }

  const prices = await prisma.stockPrice.findMany({
    where: {
      stockSymbol: symbol,
    },
    orderBy: {
      time: "desc",
    },
    take: 20, 
  });

  // Format to [{ time, open, high, low, close }]
  const formatted = prices.map((p) => ({
    time:
  new Date(p.time.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    open: Math.round(p.open*100)/100,
    high: Math.round(p.high*100)/100,
    low: Math.round(p.low*100)/100,
    close: Math.round(p.close*100)/100,
  }));

  return NextResponse.json(formatted);
}