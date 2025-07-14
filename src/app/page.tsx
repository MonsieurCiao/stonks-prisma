import StockChartArea from "./_components/StockChartArea";

const data = [
  { time: "17.30", price: 400 },
  { time: "18.30", price: 300 },
  { time: "19.30", price: 500 },
  { time: "20.30", price: 200 },
  { time: "21.30", price: 100 },
];

export default function Home() {
  return (
    <div>
      <section className="flex justify-center items-center pt-16">
        <StockChartArea data={data} />
      </section>
    </div>
  );
}
