from paper_api.models import UserBalance, UserStock, UserTransaction
from paper_api.serializers import (
    UserStockSerializer,
)
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken


def get_user_id(request):
    if "Authorization" not in request.headers:
        return None
    access_token = request.headers["Authorization"]
    token = AccessToken(access_token)
    user_id = token["user_id"]
    user = User.objects.get(id=user_id)
    return user


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
