from rest_framework import serializers
from paper_api.models import Ticker


class TickerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticker
        fields = ["ticker", "api"]
