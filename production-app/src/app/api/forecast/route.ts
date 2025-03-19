import { NextResponse } from "next/server";

interface ProductionItem {
    date: string;
    product_id: number;
    product_name: string;
    scheduled_units: number;
}
    
async function getForecastData(): Promise<ProductionItem[]> {
    try {
        const response = await fetch("http://localhost:5001/forecast");
        return await response.json();
    } catch (error) {
        console.error("Error fetching production schedule:", error);
        return [];
    }
}

export async function GET() {
    try {
        const response = await fetch("http://localhost:5001/forecast");
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        return NextResponse.json({ 
            message: "Error fetching forecast data", 
            status: "error",
            year: 0,
            products: []
        }, { status: 500 });
    }
}