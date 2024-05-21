from django.contrib import admin
from django.urls import path, include
from paper_api.controllers import (
    TickerViewSet,
    TickerView,
    APIsView,
    YFinanceHistoryView,
    YFinanceFinancialsView,
    UserBalanceView,
    UserTransactionView,
    UserStockView,
)

# TODO:
# note: default limit should be 10 for each
# note: yfinance should not require an api key
# /get_apis -> returns all compatible apis and their ids. default: yfinance
# /yfinance/<ticker, api, ...> -> returns all data for a given ticker from an api with filtering
# /tickers/?<api, ...> -> returns all ticker data for a given api with filtering
# /buy/<ticker, api, api_key, user_token, username> -> buys a stock for a given user
# /sell/<ticker, api, api_key, user_token, username> -> sells a stock for a given user

# TODO:
# /user/<username> -> returns all user data
# /user/<username>/transactions -> returns all user transactions
# /user/<username>/stocks -> returns all user stocks
# /user/<username>/balance -> returns user balance
# /user/<username>/balance/add -> adds money to user balance
# /user/<username>/balance/remove -> removes money from user balance

urlpatterns = [
    path("tickers/", TickerViewSet.as_view({"get": "list"}), name="ticker_list"),
    path("ticker/", TickerView.as_view(), name="ticker_list"),
    path("apis/", APIsView.as_view(), name="apis"),
    # yfinance specific
    path(
        "yfinance/history/<str:ticker>&<str:time>/",
        YFinanceHistoryView.as_view(),
        name="yfinance",
    ),
    path(
        "yfinance/history/<str:ticker>/", YFinanceHistoryView.as_view(), name="yfinance"
    ),
    path(
        "yfinance/financials/<str:ticker>/",
        YFinanceFinancialsView.as_view(),
        name="yfinance",
    ),
    path("user/balance/", UserBalanceView.as_view(), name="user_balance"),
    path("user/transaction/", UserTransactionView.as_view(), name="user_transaction"),
    path("user/stock/", UserStockView.as_view(), name="user_stock"),
]
