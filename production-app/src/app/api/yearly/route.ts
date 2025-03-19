import { NextResponse } from "next/server";

interface ProductionItem {
    date: string;
    product_id: number;
    product_name: string;
    scheduled_units: number;
}
    
async function getYearlyProduction(params: string): Promise<ProductionItem[]> {
    try {
        const response = await fetch(`http://localhost:5001/generate-production-schedule${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching production schedule:", error);
        throw error; // Propagate the error
    }
}

let productionData: ProductionItem[] = [];

export async function GET() {
    return NextResponse.json(productionData);
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Build the query string properly
        const params = new URLSearchParams({
            max_daily_capacity: data.max_daily_capacity.toString(),
            machine_efficiency: data.machine_efficiency.toString(),
            available_shifts_per_day: data.available_shifts_per_day.toString(),
            hours_per_shift: data.hours_per_shift.toString(),
            downtime_schedule: data.downtime_schedule // This is already stringified
        }).toString();

        // Get new production data
        productionData = await getYearlyProduction(`?${params}`);
        
        // Return the new data
        return NextResponse.json({ 
            success: true, 
            data: productionData 
        });
    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to update production schedule" 
        }, { status: 500 });
    }
}