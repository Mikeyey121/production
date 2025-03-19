import { cache } from 'react';

interface Product {
  product_id: number;
  product_name: string;
  total_units: number;
  season_start: string;
  season_end: string;
}

interface ForecastDataType {
  year: number;
  products: Product[];
  message?: string;
  status?: string;
}

// Use React's cache to prevent duplicate requests
const getForecastData = cache(async (): Promise<ForecastDataType> => {
  try {
    const response = await fetch("http://localhost:3000/api/forecast", { 
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate once per hour
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return { 
      message: "Error fetching forecast data", 
      status: "error",
      year: 0,
      products: []
    };
  }
});

export default async function ForecastData() {
  const forecastData = await getForecastData();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Forecast Data</h2>
      <p className="mb-4"><span className="font-bold">Year:</span> {forecastData.year}</p>
      
      <div className="grid grid-cols-1 gap-4">
        {forecastData.products && forecastData.products.map((product: Product) => (
          <div 
            className="p-4 border rounded-md bg-gray-50 hover:shadow-md transition-shadow" 
            key={product.product_id}
          >
            <h3 className="font-bold text-lg mb-2">{product.product_name}</h3>
            <p><span className="font-semibold">Total Units:</span> {product.total_units.toLocaleString()}</p>
            <p><span className="font-semibold">Start Date:</span> {product.season_start}</p>
            <p><span className="font-semibold">End Date:</span> {product.season_end}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

