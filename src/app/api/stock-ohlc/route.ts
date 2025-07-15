import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prices = await prisma.stockPrice.findMany({
    where: {
      stockSymbol: "GLSCH",
    },
    orderBy: {
      time: "desc",
    },
    take: 50, 
  });

  // Format to [{ time, open, high, low, close }]
  const formatted = prices.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    open: Math.round(p.open*100)/100,
    high: Math.round(p.high*100)/100,
    low: Math.round(p.low*100)/100,
    close: Math.round(p.close*100)/100,
  }));

  return NextResponse.json(formatted);
}