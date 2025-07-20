import Link from "next/link";
import StockChartArea from "./_components/StockChartArea";
import { getUserIdFromSession } from "../../lib/session";
import CandleChart from "./_components/CandleChart";

export default async function Home() {
  const { userId } = await getUserIdFromSession();
  return (
    <div>
      <h1 className="text-4xl text-center mt-8">Welcome to Stonks</h1>
      <div className="flex gap-4 justify-center items-center mt-8">
        <Link href={userId ? `/users/${userId}` : "/authentication"}>
          <button className="bg-secondary-blue rounded-lg p-2 hover:bg-primary-blue transition-colors duration-200 cursor-pointer text-xl">
            Get Started
          </button>
        </Link>
      </div>
      <section className="flex flex-col gap-4 justify-center items-center pt-16">
        <StockChartArea stockSymbol="GLSCH" />
        <CandleChart stockSymbol="GLSCH" />
      </section>
    </div>
  );
}
