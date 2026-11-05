from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "<h1>Willkommen auf meiner Website!</h1><p>Meine erste persönliche Website!</p>"

if __name__ == "__main__":
    app.run(debug=True)
