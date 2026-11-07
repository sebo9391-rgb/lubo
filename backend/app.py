
from flask import Flask, render_template, send_from_directory
from pathlib import Path

# Project directories
PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"
GAMES_DIR = PROJECT_ROOT / "games"

# Flask configuration
app = Flask(
    __name__,
    template_folder=str(FRONTEND_DIR),
    static_folder=None
)

# Main website
@app.route("/")
def home():
    return render_template("index.html")


# Game page
@app.route("/game")
def game():
    return render_template("base-game.html")


# CSS, images and other frontend files
@app.route("/static/<path:filename>", endpoint="static")
def static_files(filename):
    return send_from_directory(FRONTEND_DIR, filename)


# Game engine JavaScript files
@app.route("/games/<path:filename>")
def game_files(filename):
    return send_from_directory(GAMES_DIR, filename)


if __name__ == "__main__":
    app.run(debug=True)

    