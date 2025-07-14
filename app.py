# import logging
import pickle
from flask import Flask, request, render_template, jsonify
import os
import sys
import time
import pandas as pd

from src.bike_sharing_ml.utils.logger import logging
from src.bike_sharing_ml.utils.exception import CustomException


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict_user_data():
    user_input_data = {
        'Date' : request.form.get('date'),
        'Hour' : request.form.get("hour"),
        'Holiday' : request.form.get('holiday'), 
        'Functioning Day': request.form.get('functioningDay') ,
        'Temperature(캜)' : request.form.get('temperature'),
        'Humidity(%)': request.form.get('humidity'),
        'Wind speed (m/s)' : request.form.get('windSpeed'), 
        'Visibility (10m)' : request.form.get('visibility'),
        'Dew point temperature(캜)' : request.form.get('dewPointTemperature'),
        'Solar Radiation (MJ/m2)': request.form.get('solarRadiation'), 
        'Rainfall(mm)' : request.form.get('rainfall'),
        'Snowfall (cm)': request.form.get('snowfall')
    }

    user_data = pd.DataFrame([user_input_data])
    logging.info(f"User input data: {user_input_data}")
    return render_template('predict.html', user_input=user_input_data)  # Add this line


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5050))  # Get the port from environment variable or use 5000
    app.run(host= '0.0.0.0', port=port, debug=True)  # Run the Flask app on localhost
    logging.info(f"Flask app is running on port {port}")
    logging.info("Server started successfully")

