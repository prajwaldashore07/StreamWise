from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = "d7d0579f82ce09ea6dfe7b54d1438395"

@app.route('/api/tmdb/<path:endpoint>', methods=['GET'])
def proxy(endpoint):
    tmdb_url = f'https://api.themoviedb.org/3/{endpoint}'
    params = dict(request.args)
    params['api_key'] = TMDB_API_KEY

    response = requests.get(tmdb_url, params=params)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

    from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return 'StreamWise is Live!'
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='load page')

@app.route('/')
def serve_home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(app.static_folder, path)

