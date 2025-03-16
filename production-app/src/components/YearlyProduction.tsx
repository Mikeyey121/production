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

export default async function YearlyProduction() {
    const yearlyProduction = await getYearlyProduction();
    
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Daily Production Details</h3>
            <div className="max-h-96 overflow-y-auto">
                {yearlyProduction.map((item, index) => (
                    <div key={`${item.date}-${item.product_id}-${index}`} className="flex flex-row p-2 border-b">
                        <p><span className="font-bold">Date:</span> {item.date} - <span className="font-bold">Product:</span> {item.product_name} - <span className="font-bold">Scheduled Units:</span> {item.scheduled_units.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
// [
//     {
//       "date": "2025-06-01",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-02",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-03",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-04",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-05",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-06",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-07",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-08",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-09",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-10",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-11",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-12",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-13",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-14",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-15",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-16",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-17",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-18",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-19",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-20",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-21",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-22",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-23",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-24",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-25",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-26",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-27",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-28",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-29",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-06-30",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-01",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-01",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-02",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-02",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-03",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-03",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-04",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-04",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-05",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-05",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-06",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-06",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-07",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-07",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-08",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-08",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-09",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-09",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-10",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-10",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-11",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-11",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-12",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-12",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-13",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-13",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-14",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-14",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-15",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-15",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 3000
//     },
//     {
//       "date": "2025-07-16",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-16",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-17",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-17",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-18",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-18",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-19",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-19",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-20",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-20",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-21",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-21",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-22",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-22",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-23",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-23",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-24",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-24",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-25",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-25",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-26",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-26",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-27",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-27",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-28",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-28",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-29",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-29",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-30",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-30",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-07-31",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 12000
//     },
//     {
//       "date": "2025-07-31",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 6000
//     },
//     {
//       "date": "2025-08-01",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-01",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-01",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-02",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-02",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-02",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-03",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-03",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-03",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-04",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-04",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-04",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-05",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-05",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-05",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-06",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-06",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-06",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-07",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-07",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-07",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-08",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-08",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-08",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-09",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-09",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-09",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-10",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-10",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-10",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-11",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-11",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-11",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-12",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-12",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-12",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-13",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-13",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-13",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-14",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-14",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-14",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-15",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-15",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-15",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-16",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-16",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-16",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-17",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-17",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-17",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-18",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-18",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-18",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-19",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-19",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-19",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-20",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-20",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-20",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-21",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-21",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-21",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-22",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-22",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-22",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-23",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-23",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-23",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-24",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-24",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-24",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-25",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-25",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-25",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-26",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-26",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-26",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-27",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-27",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-27",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-28",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-28",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-28",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-29",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-29",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-29",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-30",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-30",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-30",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-31",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-08-31",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-08-31",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-01",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-01",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-01",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-01",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-02",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-02",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-02",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-02",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-03",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-03",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-03",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-03",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-04",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-04",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-04",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-04",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-05",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-05",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-05",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-05",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-06",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-06",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-06",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-06",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-07",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-07",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-07",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-07",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-08",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-08",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-08",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-08",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-09",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-09",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-09",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-09",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-10",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 13500
//     },
//     {
//       "date": "2025-09-10",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-10",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-10",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-11",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-11",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-11",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-11",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-12",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-12",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-12",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-12",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-13",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-13",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-13",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-13",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-14",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-14",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-14",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-14",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-15",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-15",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-15",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-15",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-16",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-16",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-16",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-16",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-17",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-17",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-17",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-17",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-18",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-18",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-18",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-18",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-19",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-19",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-19",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-19",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-20",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-20",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-20",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-20",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-21",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-21",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-21",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-21",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-22",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-22",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-22",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-22",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-23",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-23",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-23",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-23",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-24",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-24",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-24",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-24",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-25",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-25",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-25",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-25",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-26",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-26",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-26",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-26",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-27",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-27",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-27",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-27",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-28",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-28",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-28",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-28",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-29",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-29",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-29",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-29",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-30",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-09-30",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-30",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-09-30",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-01",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-01",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-01",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-01",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-02",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-02",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-02",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-03",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-03",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-03",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-04",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-04",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-04",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-05",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-05",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-05",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-06",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-06",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-06",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-07",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-07",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-07",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-08",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-08",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-08",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-09",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-09",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-09",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-10",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-10",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-10",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-11",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-11",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-11",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-12",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-12",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-12",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-13",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-13",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-13",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-14",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-14",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-14",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-15",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-15",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-15",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-16",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-16",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-16",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-17",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-17",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-17",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-18",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-18",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-18",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-19",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-19",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-19",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-20",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-20",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-20",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-21",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-21",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-21",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-22",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-22",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-22",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-22",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-23",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-23",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-23",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-23",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-24",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-24",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-24",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-24",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-25",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-25",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-25",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-25",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-26",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-26",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-26",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-26",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-27",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-27",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-27",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-27",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-28",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-28",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-28",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-28",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-29",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-29",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-29",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-29",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-30",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-30",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-30",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-30",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-31",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-10-31",
//       "product_id": 1,
//       "product_name": "Canned Peaches",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-31",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-10-31",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-01",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-01",
//       "product_id": 2,
//       "product_name": "Canned Pears",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-01",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-02",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-02",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-03",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-03",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-04",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-04",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-05",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-05",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-06",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-06",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-07",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-07",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-08",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-08",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-09",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-09",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-10",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-10",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-11",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-11",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-12",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-12",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-13",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-13",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-14",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-14",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-15",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-15",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-16",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-16",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-17",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-17",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-18",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-18",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-19",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-19",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-20",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-20",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-21",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-21",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-22",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-22",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-23",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-23",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-24",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-24",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-25",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-25",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-26",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-26",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-27",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-27",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-28",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-28",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-29",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-29",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-11-30",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-11-30",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-12-01",
//       "product_id": 3,
//       "product_name": "Tomato Paste",
//       "scheduled_units": 18000
//     },
//     {
//       "date": "2025-12-01",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 0
//     },
//     {
//       "date": "2025-12-02",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-03",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-04",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-05",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-06",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-07",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-08",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-09",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-10",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-11",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-12",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-13",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-14",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     },
//     {
//       "date": "2025-12-15",
//       "product_id": 4,
//       "product_name": "Fruit Cocktail",
//       "scheduled_units": 9000
//     }
//   ]
