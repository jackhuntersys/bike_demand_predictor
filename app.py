# import logging
import pickle


from flask import Flask, request, render_template, jsonify
import os
import sys
import time
import pandas as pd
import numpy as np

import joblib

from src.bike_sharing_ml.utils.logger import logging
from src.bike_sharing_ml.utils.exception import CustomException
from src.bike_sharing_ml.data.preprocess import DataTransformation


preprocessor_obj_file_path = os.path.join('database/processed', "preprocessor.pkl")
preprocessor = joblib.load(preprocessor_obj_file_path)

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict_user_data():
    
    
    user_input_data = {          
        'Hour' : request.form.get("hour"),
        'Temperature(캜)' : request.form.get('temperature'),
        'Humidity(%)': request.form.get('humidity'),
        'Wind speed (m/s)' : request.form.get('windSpeed'), 
        'Visibility (10m)' : request.form.get('visibility'),
        'Dew point temperature(캜)' : request.form.get('dewPointTemperature'),
        'Solar Radiation (MJ/m2)': request.form.get('solarRadiation'), 
        'Rainfall(mm)' : request.form.get('rainfall'),
        'Snowfall (cm)': request.form.get('snowfall'),
        'Seasons' : request.form.get('season'),
        'Holiday' : request.form.get('holiday'), 
        'Functioning Day': request.form.get('functioningDay'),
        'Year' : request.form.get('year'),
        'Month': request.form.get('month'),    
        'Day': request.form.get('day')
    }

    user_data = pd.DataFrame([user_input_data])
    # data_df = preprocessor.transform((user_data))

    logging.info(f"User input data: {user_input_data}")
    return jsonify(user_data.to_dict(orient='records'))
    # return render_template('predict.html', user_input=user_input_data)  # Add this line


if __name__ == '__main__':
       
    port = int(os.environ.get('PORT', 5001))  # Get the port from environment variable or use 5000
    logging.info(f"Flask app is running on port {port}")
    app.run(host= '0.0.0.0', port=port, debug=True)  # Run the Flask app on localhost
    logging.info("Server started successfully")
   

