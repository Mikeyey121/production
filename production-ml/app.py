from flask import Flask, jsonify, request
import datetime
import random
import uuid

app = Flask(__name__)

@app.route("/")
def hello():
    # Basic info endpoint
    data = {
        "message": "Hello World!",
        "timestamp": datetime.datetime.now().isoformat(),
        "status": "success"
    }
    return jsonify(data)

@app.route("/data")
def get_data():
    # Generate some random data
    data = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.datetime.now().isoformat(),
        "values": [random.randint(1, 100) for _ in range(5)],
        "metadata": {
            "source": "Flask API",
            "type": "random"
        }
    }
    return jsonify(data)

if __name__ == "__main__":
    # Change port to avoid conflict with AirTunes/AirPlay
    app.run(debug=True, host='0.0.0.0', port=5001)