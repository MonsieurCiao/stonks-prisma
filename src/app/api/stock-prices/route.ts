
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
    take: 50, // latest 50 data points, why does this only take 50 and not slide when new come in?
  });

  // Format to { time, price }
  const formatted = prices.map((p) => ({
    time: p.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    price: p.price,
  }));

  return NextResponse.json(formatted);
}