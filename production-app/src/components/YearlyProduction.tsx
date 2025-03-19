'use client'
import { useState, useEffect } from 'react';

interface ProductionItem {
    date: string;
    product_id: number;
    product_name: string;
    scheduled_units: number;
}

export default function YearlyProduction() {
    const [yearlyProduction, setYearlyProduction] = useState<ProductionItem[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch("/api/yearly");
            const data = await response.json();
            setYearlyProduction(data);
        } catch (error) {
            console.error("Error fetching production schedule:", error);
        }
    };

    useEffect(() => {
        fetchData();

        // Listen for the custom event
        window.addEventListener('productionUpdated', fetchData);
        
        return () => {
            window.removeEventListener('productionUpdated', fetchData);
        };
    }, []);

    // Group production data by month and product
    const productionByMonth = yearlyProduction.reduce((acc, item) => {
        // Extract month and year from date
        const [year, month] = item.date.split('-');
        const monthYear = `${new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleString('default', { month: 'long' })} ${year}`;
        if (!acc[monthYear]) {
            acc[monthYear] = {};
        }
        
        if (!acc[monthYear][item.product_name]) {
            acc[monthYear][item.product_name] = 0;
        }
        
        acc[monthYear][item.product_name] += item.scheduled_units;
        return acc;
    }, {} as Record<string, Record<string, number>>);
    
    // Get unique product names
    const productNames = Array.from(new Set(yearlyProduction.map(item => item.product_name)));
    
    // Convert to array and sort by date
    const monthlyData = Object.entries(productionByMonth).map(([monthYear, products]) => {
        const [month, yearStr] = monthYear.split(' ');
        const monthIndex = new Date(`${month} 1, ${yearStr}`).getMonth();
        return {
            monthYear,
            monthIndex,
            year: parseInt(yearStr),
            products
        };
    }).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthIndex - b.monthIndex;
    });
    
    return (
        <>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Yearly Production Schedule</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-4 text-left border-b">Month</th>
                            {productNames.map(product => (
                                <th key={product} className="py-3 px-4 text-left border-b">
                                    {product}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyData.map(({ monthYear, products }, index) => (
                            <tr key={monthYear} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="py-3 px-4 border-b font-medium">{monthYear}</td>
                                {productNames.map(product => (
                                    <td key={`${monthYear}-${product}`} className="py-3 px-4 border-b">
                                        {products[product] ? products[product].toLocaleString() : 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="mt-6 text-sm text-gray-500">
                <p>* All values represent scheduled production units</p>
            </div>
        </div>
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Daily Production Details</h3>
            <div className="max-h-96 overflow-y-auto">
                {yearlyProduction.map((item, index) => (
                    <div key={`${item.date}-${item.product_id}-${index}`} className="flex flex-row p-2 border-b">
                        <p><span className="font-bold">Date:</span> {item.date} - <span className="font-bold">Product:</span> {item.product_name} - <span className="font-bold">Scheduled Units:</span> {item.scheduled_units.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div> */}
        </>
    );
}
