// Define interfaces for the data structures
interface Downtime {
    date: string;
    reason: string;
    expected_downtime_hours: number;
}

interface ProductConstraint {
    product_id: number;
    max_units_per_day: number;
    priority_level: number;
}

interface FactoryInfo {
    factory_id: number;
    factory_name: string;
    max_daily_capacity: number;
    machine_efficiency: number;
    available_shifts_per_day: number;
    hours_per_shift: number;
    downtime_schedule: Downtime[];
    product_constraints: ProductConstraint[];
    error?: string;
}

async function getFactoryInfoData(): Promise<FactoryInfo> {
    try {
        const response = await fetch("http://localhost:5001/factory-info");
        return await response.json();
    } catch (error) {
        console.error("Error fetching factory info data:", error);
        return { error: "Failed to load factory information" } as FactoryInfo;
    }
}

export default async function FactoryInfoData() {
    const factoryInfoData = await getFactoryInfoData();
    
    return (
        <>

<div className="w-full max-w-4xl bg-background-light p-6 rounded-lg shadow-lg">
<h2 className="text-xl font-semibold text-primary m-4">{factoryInfoData.factory_name} Information</h2>

    <div className="space-y-4">
        {/* Basic factory information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><span className="font-bold">Max Daily Capacity:</span> {factoryInfoData.max_daily_capacity}</p>
            <p><span className="font-bold">Machine Efficiency:</span> {factoryInfoData.machine_efficiency}</p>
            <p><span className="font-bold">Available Shifts per Day:</span> {factoryInfoData.available_shifts_per_day}</p>
            <p><span className="font-bold">Hours per Shift:</span> {factoryInfoData.hours_per_shift}</p>
        </div>
        
        {/* Downtime Schedule */}
        <div className="mt-4">
            <h3 className="text-lg font-medium text-primary mb-2">Downtime Schedule</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Reason</th>
                            <th className="px-4 py-2 text-left">Expected Downtime (hours)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {factoryInfoData.downtime_schedule?.map((downtime, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{downtime.date}</td>
                                <td className="px-4 py-2">{downtime.reason}</td>
                                <td className="px-4 py-2">{downtime.expected_downtime_hours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
        {/* Product Constraints */}
        <div className="mt-4">
            <h3 className="text-lg font-medium text-primary mb-2">Product Constraints</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Product ID</th>
                            <th className="px-4 py-2 text-left">Max Units Per Day</th>
                            <th className="px-4 py-2 text-left">Priority Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {factoryInfoData.product_constraints?.map((product, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{product.product_id}</td>
                                <td className="px-4 py-2">{product.max_units_per_day}</td>
                                <td className="px-4 py-2">{product.priority_level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
        </>
        
    );
}