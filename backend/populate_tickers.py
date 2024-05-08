import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import os

screener = pd.read_csv("paper_api/nasdaq_screener.csv")

screener = screener.fillna("unknown")

iters = screener.iterrows()


def populate_ticker(tick):
    symbol = tick[1]["Symbol"]
    name = tick[1]["Name"]
    country = tick[1]["Country"]
    sector = tick[1]["Sector"]
    industry = tick[1]["Industry"]

    resp = requests.post(
        "http://localhost:8000/api/ticker/",
        json={
            "ticker": symbol,
            "name": name,
            "country": country,
            "sector": sector,
            "industry": industry,
        },
    )


with ThreadPoolExecutor(max_workers=8) as executor:
    executor.map(populate_ticker, iters)
