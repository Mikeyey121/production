import { NextResponse } from "next/server";

interface ProductionItem {
    date: string;
    product_id: number;
    product_name: string;
    scheduled_units: number;
}
    
async function getYearlyProduction(): Promise<ProductionItem[]> {
    try {
        const response = await fetch("http://localhost:5001/generate-production-schedule");
        return await response.json();
    } catch (error) {
        console.error("Error fetching production schedule:", error);
        return [];
    }
}

export async function GET() {
    const productionData = await getYearlyProduction();
    return NextResponse.json(productionData);
}