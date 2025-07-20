import Link from "next/link";
import CandleChart from "./_components/CandleChart";
import StockChartArea from "./_components/StockChartArea";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl text-center mt-8">Welcome to Stonks</h1>
      <div className="flex gap-4 justify-center items-center mt-8">
        <Link href="/authentication">
          <button className="bg-secondary-blue rounded-lg p-2 hover:bg-primary-blue transition-colors duration-200 cursor-pointer text-xl">
            Get Started
          </button>
        </Link>
      </div>
      <section className="flex flex-col gap-4 justify-center items-center pt-16">
        <StockChartArea />
        {/* <CandleChart /> */}
      </section>
    </div>
  );
}
