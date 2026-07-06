import os
import requests
from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import math
import psutil
import time

# Load environment variables from the parent directory's .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configuration from environment
VIDEOS_DIR = os.getenv('VIDEOS_DIR', './videos')
# Ensure VIDEOS_DIR is absolute if it's relative
if not os.path.isabs(VIDEOS_DIR):
    VIDEOS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', VIDEOS_DIR))
    
API_PORT = os.getenv('SERVER_PORT', '8080')
BOT_API_URL = f"http://127.0.0.1:{API_PORT}"

# Ensure videos directory exists
os.makedirs(VIDEOS_DIR, exist_ok=True)

def format_size(size_bytes):
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return f"{s} {size_name[i]}"

@app.route('/')
def index():
    # Fetch bot status
    bot_status = {'playing': False, 'joined': False, 'current': None, 'queue': []}
    try:
        response = requests.get(f"{BOT_API_URL}/status", timeout=2)
        if response.status_code == 200:
            bot_status = response.json()
    except requests.exceptions.RequestException:
        print("Could not connect to bot API. Is the bot running?")

    # Fetch local video files
    video_files = []
    try:
        for filename in os.listdir(VIDEOS_DIR):
            filepath = os.path.join(VIDEOS_DIR, filename)
            if os.path.isfile(filepath):
                size = os.path.getsize(filepath)
                video_files.append({
                    'name': filename,
                    'size': format_size(size),
                    'raw_size': size
                })
        video_files.sort(key=lambda x: x['name'])
    except Exception as e:
        print(f"Error reading videos dir: {e}")

    return render_template('index.html', bot_status=bot_status, video_files=video_files, stats=get_system_stats())

def get_system_stats():
    try:
        return {
            'cpu': psutil.cpu_percent(),
            'ram': psutil.virtual_memory().percent,
            'uptime': time.time() - psutil.boot_time()
        }
    except:
        return {'cpu': 0, 'ram': 0, 'uptime': 0}

@app.route('/api/stats')
def api_stats():
    return jsonify(get_system_stats())

@app.route('/api/logs')
def get_logs():
    log_file = os.path.join(os.path.dirname(__file__), '..', 'bot.log')
    if not os.path.exists(log_file):
        return jsonify({'logs': 'Log file not found yet...'})
    
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            # Return last 50 lines
            return jsonify({'logs': ''.join(lines[-50:])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/play', methods=['POST'])
def play_video():
    data = request.json
    try:
        response = requests.post(f"{BOT_API_URL}/play", json=data, timeout=2)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skip', methods=['POST'])
def skip_video():
    try:
        response = requests.post(f"{BOT_API_URL}/skip", timeout=2)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stop', methods=['POST'])
def stop_video():
    try:
        response = requests.post(f"{BOT_API_URL}/stop", timeout=2)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/loop', methods=['POST'])
def toggle_loop():
    try:
        response = requests.post(f"{BOT_API_URL}/loop", timeout=2)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(VIDEOS_DIR, filename))
        return jsonify({'success': True, 'message': 'File uploaded successfully'})

@app.route('/api/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    safe_filename = secure_filename(filename)
    filepath = os.path.join(VIDEOS_DIR, safe_filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'success': True, 'message': 'File deleted'})
    return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    # Use a different port for the web dashboard, since the bot API uses SERVER_PORT
    app.run(host='0.0.0.0', port=5000, debug=True)
