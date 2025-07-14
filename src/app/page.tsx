import StockChartArea from "./_components/StockChartArea";

export default async function Home() {
  return (
    <div>
      <section className="flex justify-center items-center pt-16">
        <StockChartArea />
      </section>
    </div>
  );
}
