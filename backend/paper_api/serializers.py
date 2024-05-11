from rest_framework import serializers
from paper_api.models import Ticker, UserStock, UserTransaction, UserBalance


class TickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticker
        fields = ["ticker", "country", "industry", "sector", "id"]


class UserStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStock
        fields = ["username", "ticker", "price", "id"]


class UserTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTransaction
        fields = [
            "transaction_type",
            "username",
            "ticker",
            "amount",
            "price",
            "id",
            "date",
        ]


class UserBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBalance
        fields = ["username", "balance"]
