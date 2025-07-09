from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='load page')
CORS(app)

TMDB_API_KEY = "d7d0579f82ce09ea6dfe7b54d1438395"  # Use env variable in production

genre_map = {
    "Happy": 35,
    "Sad": 18,
    "Excited": 28,
    "Scared": 27,
    "Inspired": 99
}

@app.route('/')
def serve_home():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_file(path):
    return send_from_directory(app.static_folder, path)

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
