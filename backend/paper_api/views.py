from django.shortcuts import render
from paper_api.models import Ticker, UserTransaction, UserBalance, UserStock
from paper_api.serializers import (
    TickerSerializer,
    UserBalanceSerializer,
    UserStockSerializer,
    UserTransactionSerializer,
)
from django.contrib.auth.models import User
from rest_framework import permissions, viewsets
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import yfinance as yf
import json
from rest_framework_simplejwt.tokens import AccessToken


def get_user_id(request):
    if "Authorization" not in request.headers:
        return None
    access_token = request.headers["Authorization"]
    token = AccessToken(access_token)
    user_id = token["user_id"]
    user = User.objects.get(id=user_id)
    return user


class TickerViewSet(viewsets.ModelViewSet):
    queryset = Ticker.objects.all()
    serializer_class = TickerSerializer


class TickerView(APIView):
    def get(self, request):
        tickers = Ticker.objects.all()
        serializer = TickerSerializer(tickers, many=False)
        return Response(serializer.data)

    def post(self, request):
        serializer = TickerSerializer(data=request.data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class APIsView(APIView):
    def get(self, request):
        return Response({"apis": ["yfinance"]})


class FinanceAPIView(APIView):
    def get(self, request):
        return {"data": "this is a base endpoint"}


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


class UserBalanceView(APIView):
    def get(self, request):
        user = get_user_id(request)

        if user is None:
            # return 401 if user is not found
            return Response(
                {"error": "access token did not contain username"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            user_balance = UserBalance.objects.get(username=user)
        except UserBalance.DoesNotExist:
            user_balance = None

        # if not found, create one
        if user_balance is None:
            user_balance = UserBalance(username=user, balance=0.0)
            user_balance.save()
            user_balance = UserBalance.objects.get(username=user)

        serializer = UserBalanceSerializer(user_balance, many=False)
        return Response(serializer.data)

    def post(self, request):
        if "amount" not in request.data:
            return Response(
                {"error": "amount not found in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = get_user_id(request)

        if user is None:
            # return 401 if user is not found
            return Response(
                {"error": "access token did not contain username"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_balance = UserBalance.objects.get(username=user)
        # if not found, create one
        if user_balance is None:
            user_balance = UserBalance(username=user, balance=0.0)
            user_balance.save()
            user_balance = UserBalance.objects.get(username=user)

        user_balance.balance += float(request.data["amount"])
        user_balance.save()

        serializer = UserBalanceSerializer(user_balance, many=False)
        return Response(serializer.data)


class UserStockView(APIView):
    def get(self, request):
        user = get_user_id(request)

        if user is None:
            # return 401 if user is not found
            return Response(
                {"error": "access token did not contain username"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_stocks = UserStock.objects.filter(username=user)
        serializer = UserStockSerializer(user_stocks, many=True)
        return Response(serializer.data)

    def post(self, request):
        if "ticker" not in request.data:
            return Response(
                {"error": "ticker not found in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "price" not in request.data:
            return Response(
                {"error": "price not found in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "amount" not in request.data:
            return Response(
                {"error": "amount not found in request"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ticker = request.data["ticker"]
        price = float(request.data["price"])
        amount = int(request.data["amount"])

        user = get_user_id(request)

        if user is None:
            # return 401 if user is not found
            return Response(
                {"error": "access token did not contain username"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # if amount negative, sell stock. also, check if user has enough stock
        if amount < 0:
            user_stock = UserStock.objects.filter(username=user, ticker=ticker)
            if len(user_stock) < abs(amount):
                return Response(
                    {"error": "user does not have enough stock"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            for i in range(abs(amount)):
                user_stock[i].delete()

            user_balance = UserBalance.objects.get(username=user)
            user_balance.balance += price * abs(amount)
            user_balance.save()

            transaction = UserTransaction(
                transaction_type="sell",
                username=user,
                ticker=ticker,
                price=price,
                amount=abs(amount),
            )
            transaction.save()

            return Response({"success": "stock sold"}, status=status.HTTP_200_OK)

        else:
            user_balance = UserBalance.objects.get(username=user)
            if user_balance.balance < price * amount:
                return Response(
                    {"error": "user does not have enough balance"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_balance.balance -= price * amount
            user_balance.save()

            for i in range(amount):
                user_stock = UserStock(username=user, ticker=ticker, price=price)
                user_stock.save()

            transaction = UserTransaction(
                transaction_type="buy",
                username=user,
                ticker=ticker,
                price=price,
                amount=amount,
            )
            transaction.save()

            return Response({"success": "stock bought"}, status=status.HTTP_200_OK)


class UserTransactionView(APIView):
    def get(self, request):
        user = get_user_id(request)

        if user is None:
            # return 401 if user is not found
            return Response(
                {"error": "access token did not contain username"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user_transactions = UserTransaction.objects.filter(username=user)
        serializer = UserTransactionSerializer(user_transactions, many=True)
        return Response(serializer.data)
