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

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = "d7d0579f82ce09ea6dfe7b54d1438395"

genre_map = {
    "Happy": 35,        # Comedy
    "Sad": 18,          # Drama
    "Excited": 28,      # Action
    "Scared": 27,       # Horror
    "Inspired": 99      # Documentary
}

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    mood = data.get("mood")
    genre_id = genre_map.get(mood, 35)

    url = f"https://api.themoviedb.org/3/discover/movie?api_key={TMDB_API_KEY}&with_genres={genre_id}&sort_by=popularity.desc"
    response = requests.get(url)
    tmdb_data = response.json()

    movies = []
    for item in tmdb_data.get("results", [])[:10]:
        movies.append({
            "title": item["title"],
            "poster": f"https://image.tmdb.org/t/p/w500{item['poster_path']}"
        })

    return jsonify(movies)


