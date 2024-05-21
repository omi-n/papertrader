from django.db import models


class Ticker(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, default="unknown")
    country = models.CharField(max_length=50, default="unknown")
    industry = models.CharField(max_length=100, default="unknown")
    sector = models.CharField(max_length=50, default="unknown")
    id = models.AutoField(primary_key=True)
