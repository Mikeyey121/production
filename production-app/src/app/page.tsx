import ForecastData from "@/components/ForecastData";
import FactoryInfoData from "@/components/FactoryInfoData";
import YearlyProduction from "@/components/YearlyProduction";
import DailyProduction from "@/components/DailyProduction";
export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_auto] items-center justify-items-center min-h-screen p-0 gap-16 font-[family-name:var(--font-geist-sans)] pt-8">
      <header className="row-start-1 flex gap-[24px] flex-wrap items-center justify-center border-b border-primary/20 w-full py-4 px-8 sm:px-20">
        <h1 className="text-2xl font-bold">Production.ai</h1>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start px-8 sm:px-20">
        {/* Display API data in a formatted card */}
        <ForecastData />
        <FactoryInfoData />
        <YearlyProduction />
        <DailyProduction />
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center border-t border-primary/20 w-full py-4 px-8 sm:px-20 mt-16">
        <p>production.ai copyright 2025</p>
      </footer>
    </div>
  );
}
