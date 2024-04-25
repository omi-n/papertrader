from django.shortcuts import render
from paper_api.models import Ticker
from paper_api.serializers import TickerSerializer
from rest_framework import permissions, viewsets
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import yfinance as yf


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


class YFinanceAPIView(APIView):
    def get(self, request, ticker, time):
        ticker = yf.Ticker(ticker)
        history = ticker.history(period=time)
        metadata = ticker.history_metadata
        return Response({"history": history, "metadata": metadata})
