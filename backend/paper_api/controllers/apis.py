from rest_framework.views import APIView
from rest_framework.response import Response


class APIsView(APIView):
    def get(self, request):
        return Response({"apis": ["yfinance"]})


class FinanceAPIView(APIView):
    def get(self, request):
        return {"data": "this is a base endpoint"}
