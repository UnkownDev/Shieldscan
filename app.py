# backend/app.py
from flask import Flask, request, jsonify
from scanner import scan_code
import os

app = Flask(__name__)

@app.route("/api/scan", methods=["POST"])
def scan():
    data = request.get_json()
    code = data.get("code", "")
    issues = scan_code(code)
    return jsonify({"total": len(issues), "issues": issues})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))