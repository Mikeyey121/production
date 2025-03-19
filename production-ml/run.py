import json
import pandas as pd
from datetime import datetime, timedelta

# Load JSON files
with open("forecast.json", "r") as f:
    forecast_data = json.load(f)

with open("factory_info.json", "r") as f:
    factory_data = json.load(f)

# Extract factory constraints
total_available_hours = factory_data["available_shifts_per_day"] * factory_data["hours_per_shift"]
factory_capacity = factory_data["max_daily_capacity"] * factory_data["machine_efficiency"]
downtime_schedule = {d["date"]: d["expected_downtime_hours"] for d in factory_data["downtime_schedule"]}
print(downtime_schedule)
product_constraints = {p["product_id"]: p for p in factory_data["product_constraints"]}

# Track total production per product
total_produced = {product["product_id"]: 0 for product in forecast_data["products"]}

# Generate production schedule
def generate_production_schedule(max_daily_capacity, machine_efficinecy, available_shifts_per_day, hours_per_shift, downtime_schedule):
    factory_capacity = max_daily_capacity * machine_efficinecy

    production_schedule = []
    
    # Create a dictionary to store production needs per day
    daily_needs = {}
    
    # First, determine maximum daily production for each product
    for product in forecast_data["products"]:
        product_id = product["product_id"]
        total_units = product["total_units"]
        start_date = datetime.strptime(product["season_start"], "%Y-%m-%d")
        end_date = datetime.strptime(product["season_end"], "%Y-%m-%d")
        
        days_available = (end_date - start_date).days
        max_daily_units = product_constraints[product_id]["max_units_per_day"]
        
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            
            if date_str not in daily_needs:
                daily_needs[date_str] = []
            
            daily_needs[date_str].append({
                "product_id": product_id,
                "product_name": product["product_name"],
                "max_units": max_daily_units,
                "priority": product_constraints[product_id]["priority_level"],
                "remaining_units": total_units  # Track remaining production units
            })
            
            current_date += timedelta(days=1)
    
    # Allocate daily production based on priority when multiple products overlap
    for date, products in daily_needs.items():
        # Adjust factory capacity for downtime
        if date in downtime_schedule:
            adjusted_capacity = factory_capacity * ((total_available_hours - downtime_schedule[date]) / total_available_hours)
        else:
            adjusted_capacity = factory_capacity
        
        # Sort products by priority (lower number = higher priority)
        products.sort(key=lambda x: x["priority"])
        
        remaining_capacity = adjusted_capacity
        for product in products:
            product_id = product["product_id"]
            max_possible_production = min(product["max_units"], remaining_capacity)
            remaining_forecast_units = forecast_data["products"][product_id - 1]["total_units"] - total_produced[product_id]
            
            # Ensure we do not exceed total forecasted units
            daily_production = min(max_possible_production, remaining_forecast_units)
            
            if daily_production > 0:
                total_produced[product_id] += daily_production
                remaining_capacity -= daily_production
                
                production_schedule.append({
                    "date": date,
                    "product_id": product_id,
                    "product_name": product["product_name"],
                    "scheduled_units": round(daily_production)
                })
    
    return production_schedule

# Generate schedule
schedule = generate_production_schedule(factory_data["max_daily_capacity"],factory_data["machine_efficiency"],3,8,downtime_schedule)

# Convert to DataFrame and save as CSV
schedule_df = pd.DataFrame(schedule)
schedule_df.to_csv("daily_production_schedule.csv", index=False)

# Print sample output
print(schedule_df.head())


# Calculate total scheduled units per product
total_scheduled_per_product = schedule_df.groupby("product_id")["scheduled_units"].sum()

# Load forecasted total units for reference
forecast_totals = {product["product_id"]: product["total_units"] for product in forecast_data["products"]}

# Print debugging information
print("\n🔍 Debugging: Total Scheduled vs. Forecasted Units")
for product_id, scheduled_total in total_scheduled_per_product.items():
    forecast_total = forecast_totals.get(product_id, 0)
    print(f"Product {product_id}: Scheduled = {scheduled_total}, Forecast = {forecast_total}")

    # Check if we exceeded the forecast
    if scheduled_total > forecast_total:
        print(f"⚠️ WARNING: Product {product_id} EXCEEDED forecasted units!")

# Save debugging output to a CSV file
debug_df = pd.DataFrame({
    "product_id": total_scheduled_per_product.index,
    "scheduled_units": total_scheduled_per_product.values,
    "forecast_units": [forecast_totals[pid] for pid in total_scheduled_per_product.index]
})
debug_df.to_csv("debug_scheduled_vs_forecast.csv", index=False)
