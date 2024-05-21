import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import os
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--num_workers", type=int, default=os.cpu_count())
parser.add_argument("--max_stocks", type=int, default=100)
args = parser.parse_args()

screener = pd.read_csv("paper_api/nasdaq_screener.csv")

screener = screener.fillna(0)

iters = screener.iterrows()


def _limit_iter(iters, limit):
    for i in range(limit):
        yield next(iters)


iters = _limit_iter(iters, args.max_stocks)


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


with ThreadPoolExecutor(max_workers=os.cpu_count()) as executor:
    executor.map(populate_ticker, iters)
