import CandleChart from "./_components/CandleChart";
import StockChartArea from "./_components/StockChartArea";

export default function Home() {
  return (
    <div>
      <section className="flex flex-col gap-4 justify-center items-center pt-16">
        <StockChartArea />
        <CandleChart />
      </section>
    </div>
  );
}
