import json
import pandas as pd
from datetime import datetime, timedelta

# Load JSON files
with open("forecast.json", "r") as f:
    forecast_data = json.load(f)

with open("factory_info.json", "r") as f:
    factory_data = json.load(f)

# Extract factory constraints
factory_capacity = factory_data["max_daily_capacity"] * factory_data["machine_efficiency"]
downtime_schedule = {d["date"]: d["expected_downtime_hours"] for d in factory_data["downtime_schedule"]}
product_constraints = {p["product_id"]: p for p in factory_data["product_constraints"]}

# Generate production schedule
def generate_production_schedule():
    production_schedule = []
    
    for product in forecast_data["products"]:
        product_id = product["product_id"]
        total_units = product["total_units"]
        start_date = datetime.strptime(product["season_start"], "%Y-%m-%d")
        end_date = datetime.strptime(product["season_end"], "%Y-%m-%d")
        
        days_available = (end_date - start_date).days
        daily_target = total_units / days_available  # Evenly distribute across season
        max_daily_units = product_constraints[product_id]["max_units_per_day"]
        
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime("%Y-%m-%d")
            
            # Adjust for downtime
            if date_str in downtime_schedule:
                adjusted_capacity = factory_capacity * ((24 - downtime_schedule[date_str]) / 24)
            else:
                adjusted_capacity = factory_capacity
            
            # Determine daily production
            daily_production = min(daily_target, max_daily_units, adjusted_capacity)
            
            production_schedule.append({
                "date": date_str,
                "product_id": product_id,
                "product_name": product["product_name"],
                "scheduled_units": round(daily_production)
            })
            
            current_date += timedelta(days=1)
    
    return production_schedule

# Generate schedule
schedule = generate_production_schedule()

# Convert to DataFrame and save as CSV
schedule_df = pd.DataFrame(schedule)
schedule_df.to_csv("daily_production_schedule.csv", index=False)

# Print sample output
print(schedule_df.head())
