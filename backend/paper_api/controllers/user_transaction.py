from paper_api.models import UserTransaction
from paper_api.serializers import UserTransactionSerializer
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
