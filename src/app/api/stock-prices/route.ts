
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

  // Format to { time, price }
  const formatted = prices.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: (p.high + p.low + p.open + p.close) / 4, // Average price for display
  }));

  return NextResponse.json(formatted);
}