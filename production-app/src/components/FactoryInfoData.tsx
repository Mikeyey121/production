'use client'
import { useState } from "react";

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

export default function FactoryInfoData() {
    // Use state to manage the factory data locally
    const [factoryData, setFactoryData] = useState<FactoryInfo>({
        "factory_id": 101,
        "factory_name": "California Processing Plant",
        "max_daily_capacity": 20000,
        "machine_efficiency": 90,
        "available_shifts_per_day": 2,
        "hours_per_shift": 8,
        "downtime_schedule": [
          {"date": "2025-07-15", "reason": "Maintenance", "expected_downtime_hours": 4},
          {"date": "2025-09-10", "reason": "Line Cleaning", "expected_downtime_hours": 6}
        ],
        "product_constraints": [
          {
            "product_id": 1,
            "max_units_per_day": 12000,
            "priority_level": 2
          },
          {
            "product_id": 2,
            "max_units_per_day": 10000,
            "priority_level": 3
          },
          {
            "product_id": 3,
            "max_units_per_day": 18000,
            "priority_level": 1
          },
          {
            "product_id": 4,
            "max_units_per_day": 9000,
            "priority_level": 4
          }
        ]
    });

    // Update a specific field in the factory data
    const updateField = (field: keyof FactoryInfo, value: any) => {
        setFactoryData({
            ...factoryData,
            [field]: value
        });
    };

    // Add new downtime entry
    const addDowntime = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newDowntime = {
            date: formData.get('date') as string,
            reason: formData.get('reason') as string,
            expected_downtime_hours: parseInt(formData.get('hours') as string, 10)
        };

        setFactoryData({
            ...factoryData,
            downtime_schedule: [...factoryData.downtime_schedule, newDowntime]
        });

        // Reset the form
        (event.target as HTMLFormElement).reset();
    };

    // Remove downtime entry
    const removeDowntime = (index: number) => {
        setFactoryData({
            ...factoryData,
            downtime_schedule: factoryData.downtime_schedule.filter((_, i) => i !== index)
        });
    };

    // Add this new function to handle the update
    const handleUpdateProduction = async () => {
        try {
            const response = await fetch('/api/yearly', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    max_daily_capacity: factoryData.max_daily_capacity,
                    machine_efficiency: factoryData.machine_efficiency,
                    available_shifts_per_day: factoryData.available_shifts_per_day,
                    hours_per_shift: factoryData.hours_per_shift,
                    downtime_schedule: JSON.stringify(factoryData.downtime_schedule)
                })
            });
            
            const result = await response.json();
            
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to update production schedule');
            }
            
            console.log('Production schedule updated successfully');
            // Dispatch event to refresh YearlyProduction
            window.dispatchEvent(new Event('productionUpdated'));
        } catch (error) {
            console.error('Error updating production schedule:', error);
            alert('Failed to update production schedule. Please try again.');
        }
    };

    return (
        <>
            <div className="w-full bg-background-light p-10 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-primary mb-10">{factoryData.factory_name} Information</h2>
                <div className="space-y-4">
                    {/* Basic factory information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <p className="flex flex-row gap-2 justify-between"><label>Maximum Daily Capacity:</label>
                            <input 
                                className="border rounded px-2 py-1"
                                type="number" 
                                value={factoryData.max_daily_capacity} 
                                onChange={(e) => updateField('max_daily_capacity', parseInt(e.target.value, 10))}
                            />
                        </p>
                        <p className="flex flex-row gap-2 justify-between"><label>Average Machine Efficiency % :</label>
                            <input 
                                className="border rounded px-2 py-1"
                                type="number" 
                                value={factoryData.machine_efficiency} 
                                onChange={(e) => updateField('machine_efficiency', parseInt(e.target.value))}
                            />
                        </p>
                        <p className="flex flex-row gap-2 justify-between"><label>Available Shifts per Day:</label>
                            <input 
                                className="border rounded px-2 py-1"
                                type="number" 
                                value={factoryData.available_shifts_per_day} 
                                onChange={(e) => updateField('available_shifts_per_day', parseInt(e.target.value, 10))}
                            />
                        </p>
                        <p className="flex flex-row gap-2 justify-between"><label>Average Hours per Shift:</label>
                            <input 
                                className="border rounded px-2 py-1"
                                type="number" 
                                value={factoryData.hours_per_shift} 
                                onChange={(e) => updateField('hours_per_shift', parseInt(e.target.value, 10))}
                            />
                        </p>
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
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {factoryData.downtime_schedule?.map((downtime, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2">{downtime.date}</td>
                                            <td className="px-4 py-2">{downtime.reason}</td>
                                            <td className="px-4 py-2">{downtime.expected_downtime_hours}</td>
                                            <td className="px-4 py-2">
                                                <button 
                                                    onClick={() => removeDowntime(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Add new downtime form */}
                            <form onSubmit={addDowntime} className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        className="border rounded px-2 py-1"
                                    />
                                    <input
                                        type="text"
                                        name="reason"
                                        placeholder="Reason"
                                        required
                                        className="border rounded px-2 py-1"
                                    />
                                    <input
                                        type="number"
                                        name="hours"
                                        placeholder="Hours"
                                        required
                                        min="1"
                                        className="border rounded px-2 py-1"
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                    >
                                        Add Downtime
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Product Constraints */}
                    {/* <div className="mt-4">
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
                                    {factoryData.product_constraints?.map((product, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2">{product.product_id}</td>
                                            <td className="px-4 py-2">{product.max_units_per_day}</td>
                                            <td className="px-4 py-2">{product.priority_level}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div> */}
                </div>
                
                {/* Add this at the bottom of your component, after the Product Constraints table */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleUpdateProduction}
                        className="px-6 py-2 border-2 border-black rounded-md hover:bg-gray-100 transition-colors"
                    >
                        Update Production Schedule
                    </button>
                </div>
            </div>
        </>
    );
}