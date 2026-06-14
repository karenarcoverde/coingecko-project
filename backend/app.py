from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

COINGECKO_URL = "https://api.coingecko.com/api/v3/simple/price"

@app.route("/crypto", methods=["GET"])
def get_crypto():
    coin = request.args.get("coin")

    if not coin:
        return jsonify({"error": "coin parameter is required"}), 400

    params = {
        "ids": coin.lower(),
        "vs_currencies": "usd",
        "include_24hr_change": "true"
    }

    response = requests.get(COINGECKO_URL, params=params)

    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data"}), 500

    data = response.json()

    if coin.lower() not in data:
        return jsonify({"error": "Coin not found"}), 404

    result = {
        "coin": coin,
        "price_usd": data[coin.lower()]["usd"],
        "change_24h": data[coin.lower()].get("usd_24h_change")
    }

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)