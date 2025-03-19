import { Suspense } from 'react';
import ForecastData from "@/components/ForecastData";
import FactoryInfoData from "@/components/FactoryInfoData";
import YearlyProduction from "@/components/YearlyProduction";
import DailyProduction from "@/components/DailyProduction";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_auto] items-center justify-items-center min-h-screen p-0 gap-16 font-[family-name:var(--font-geist-sans)] pt-8">
      <header className="row-start-1 flex gap-[24px] flex-wrap items-center justify-center border-b border-primary/20 w-full py-4 px-8 sm:px-20">
        <h1 className="text-2xl font-bold">Production.ai</h1>
      </header>
      <main className="flex flex-col row-start-2 items-center sm:items-start px-8 sm:px-20">
        {/* Display API data in a formatted card */}
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            <ForecastData />
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-4 h-full">
            <div className="col-span-3 w-full">
              <FactoryInfoData/>
            </div>
            <div className="col-span-2 w-full">
              <YearlyProduction />
            </div>
            <div className="col-span-1 w-full h-full">
              <DailyProduction />
            </div>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center border-t border-primary/20 w-full py-4 px-8 sm:px-20 mt-16">
        <p>production.ai copyright 2025</p>
      </footer>
    </div>
  );
}
