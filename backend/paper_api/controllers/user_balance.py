from paper_api.models import UserBalance
from paper_api.serializers import (
    UserBalanceSerializer,
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
