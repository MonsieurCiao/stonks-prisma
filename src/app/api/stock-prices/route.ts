
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

  // Format to [{ time, price }]
  const formatted = prices.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: Math.round(p.avgPrice*100)/100,
  }));

  return NextResponse.json([formatted, prices]);
}