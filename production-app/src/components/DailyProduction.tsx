'use client'
import { useState, useEffect } from "react";

interface ProductionItem {
    date: string;
    product_id: number;
    product_name: string;
    scheduled_units: number;
}

export default function DailyProduction() {
    // Define state with proper typing
    const [productionData, setProductionData] = useState<ProductionItem[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>("2025/06/01");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/yearly');
                const data = await response.json();
                setProductionData(data);
            } catch (error) {
                console.error('Error fetching production data:', error);
            }
        };
        
        fetchData();
    }, []); 

    const allDates = productionData.map((item: ProductionItem) => item.date);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Daily Production Schedule</h2>

            <select onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}>
                {allDates.map((date, index) => (
                    <option key={date + index} value={date}>{date}</option>
                ))}
            </select>

            {productionData.length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th className="p-4">Line</th>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Scheduled Units</th>
                            </tr>
                        </thead>
                        <tbody>
                        {productionData
                            .filter((item: ProductionItem) => item.date === selectedDate)
                            .sort((a, b) => a.product_id - b.product_id)
                            .map((item: ProductionItem) => (
                                <tr key={item.product_id} className="border-b border-t border-gray-200 p-4">
                                    <td className="border-r border-l border-gray-200 p-4">{item.product_id}</td>
                                    <td className="border-r border-gray-200 p-4">{item.product_name}</td>
                                    <td className="p-4 border-r border-gray-200">{item.scheduled_units}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No production data available</p>
            )}
        </div>
    );
}
// [
//     {
//       "date": "2025-06-01",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
// ]