import json
from flask import Flask, jsonify, request
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    # Basic info endpoint
    data = {
        "message": "Hello World!",
        "timestamp": datetime.datetime.now().isoformat(),
        "status": "success"
    }
    return jsonify(data)

# Endpoint to get the factory info json data
@app.route("/factory-info")
def get_data():
    with open("factory_info.json", "r") as f:
        data = json.load(f)

    return data

# Endpoint to get the forecast json data
@app.route("/forecast")
def get_forecast():
    with open("forecast.json", "r") as f:
        data = json.load(f)
    return data

@app.route("/generate-production-schedule")
def generate_production_schedule():
    max_daily_capacity = float(request.args.get("max_daily_capacity"))
    machine_efficiency = float(request.args.get("machine_efficiency"))
    available_shifts_per_day = request.args.get("available_shifts_per_day")
    hours_per_shift = request.args.get("hours_per_shift")
    downtime_schedule = request.args.get("downtime_schedule")
    
    
    # Load JSON files
    with open("forecast.json", "r") as f:
        forecast_data = json.load(f)

    with open("factory_info.json", "r") as f:
        factory_data = json.load(f)

    # Extract factory constraints
    factory_capacity = max_daily_capacity * machine_efficiency
    #downtime_schedule = {d["date"]: d["expected_downtime_hours"] for d in factory_data["downtime_schedule"]}
    product_constraints = {p["product_id"]: p for p in factory_data["product_constraints"]}

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
                "priority": product_constraints[product_id]["priority_level"]
            })
            
            current_date += timedelta(days=1)
    
    # Allocate daily production based on priority when multiple products overlap
    for date, products in daily_needs.items():
        # Adjust factory capacity for downtime
        if date in downtime_schedule:
            adjusted_capacity = factory_capacity 
        else:
            adjusted_capacity = factory_capacity
        
        # Sort products by priority (lower number = higher priority)
        products.sort(key=lambda x: x["priority"])
        
        remaining_capacity = adjusted_capacity
        for product in products:
            daily_production = min(product["max_units"], remaining_capacity)
            remaining_capacity -= daily_production
            
            production_schedule.append({
                "date": date,
                "product_id": product["product_id"],
                "product_name": product["product_name"],
                "scheduled_units": round(daily_production)
            })
    
    return production_schedule
        

# Code to run the app
if __name__ == "__main__":
    # Change port to avoid conflict with AirTunes/AirPlay
    app.run(debug=True, host='0.0.0.0', port=5001)