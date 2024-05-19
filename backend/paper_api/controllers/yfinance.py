from rest_framework.views import APIView
from rest_framework.response import Response
import yfinance as yf
import json


class YFinanceHistoryView(APIView):
    def get(self, request, ticker, time="1d"):
        ticker = yf.Ticker(ticker)
        history = ticker.history(period=time)
        metadata = ticker.history_metadata
        return Response({"history": history, "metadata": metadata})


class YFinanceFinancialsView(APIView):
    def get(self, request, ticker):
        ticker = yf.Ticker(ticker)
        financials = {
            "income_statement": ticker.income_stmt.to_json(),
            "balance_sheet": ticker.balance_sheet.to_json(),
            "cash_flow": ticker.cash_flow.to_json(),
            "earnings_dates": ticker.earnings_dates.to_json(),
        }

        for key, value in financials.items():
            financials[key] = json.loads(value)

        return Response(financials)
