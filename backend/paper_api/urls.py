from django.contrib import admin
from django.urls import path, include

# TODO:
# note: default limit should be 10 for each
# note: yfinance should not require an api key
# /get_apis -> returns all compatible apis and their ids. default: yfinance
# /ticker/<ticker, api, ...> -> returns all data for a given ticker from an api with filtering
# /list/<api, ...> -> returns all ticker data for a given api with filtering
# /buy/<ticker, api, api_key, user_token, username> -> buys a stock for a given user
# /sell/<ticker, api, api_key, user_token, username> -> sells a stock for a given user

# TODO:
# /user/<username> -> returns all user data
# /user/<username>/transactions -> returns all user transactions
# /user/<username>/stocks -> returns all user stocks
# /user/<username>/balance -> returns user balance
# /user/<username>/balance/add -> adds money to user balance
# /user/<username>/balance/remove -> removes money from user balance

urlpatterns = []
