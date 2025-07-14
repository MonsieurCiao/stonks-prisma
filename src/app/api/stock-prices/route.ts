
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prices = await prisma.stockPrice.findMany({
    where: {
      stockSymbol: "GLSCH",
    },
    orderBy: {
      time: "asc",
    },
    take: 50, // latest 50 data points
  });

  // Format to { time, price }
  const formatted = prices.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: p.price,
  }));

  return NextResponse.json(formatted);
}