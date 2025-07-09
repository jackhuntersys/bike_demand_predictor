from flask import Flask, request, render_template
import os
import sys
import time


app = Flask(__name__)

@app.route('/')
def get_current_time():
    return render_template('index.html')



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))  # Get the port from environment variable or use 5000
    app.run(host= '0.0.0.0', port=port, debug=True)  # Run the Flask app on localhos