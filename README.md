Production App Setup Guide
This repository contains two main components:
A Next.js frontend application
A Flask API backend
Follow these instructions to set up and run both applications.
Prerequisites
Node.js (v18.17 or later)
Python (v3.8 or later)
npm or yarn package manager
pip (Python package manager)
Backend Setup (Flask API)
The backend is a Flask application that provides JSON data through various endpoints.
Installation
Navigate to the Flask application directory:
ml
Create a virtual environment (recommended):
venv
Activate the virtual environment:
On Windows:
activate
On macOS/Linux:
activate
Install the required dependencies:
flask
Running the Flask API
Start the Flask application:
py
The API will be available at:
Main endpoint: http://localhost:5001/
Data endpoint: http://localhost:5001/data
The API provides JSON responses with timestamps and random data.
Frontend Setup (Next.js)
The frontend is a Next.js application that fetches and displays data from the Flask API.
Installation
Navigate to the Next.js application directory:
app
Install the required dependencies:
install
Running the Next.js Application
Start the development server:
dev
The application will be available at http://localhost:3000
Testing the Full Stack
Make sure both applications are running simultaneously (in separate terminal windows).
Open the Next.js application in your browser at http://localhost:3000.
You should see the API response data displayed in a card on the page.
Troubleshooting
API Connection Issues
Ensure the Flask API is running on port 5001
Check for any CORS issues (though this shouldn't be a problem for local development)
Verify that the fetch URL in the Next.js app matches the Flask API URL
React Object Rendering Errors
If you see errors about objects not being valid as React children:
Make sure you're accessing specific properties of the API response (e.g., indexData.message)
Don't try to render the entire response object directly
Port Conflicts
If port 5001 is already in use, you can change it in the Flask app.py file
If port 3000 is already in use, Next.js will automatically suggest an alternative port
Development
The Flask API is in production-ml/app.py
The Next.js main page is in production-app/src/app/page.tsx
Styling is handled with Tailwind CSS
Happy coding!
