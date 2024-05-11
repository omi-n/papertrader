from django.db import models


# Create your models here.
class Ticker(models.Model):
    ticker = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100, default="unknown")
    country = models.CharField(max_length=50, default="unknown")
    industry = models.CharField(max_length=100, default="unknown")
    sector = models.CharField(max_length=50, default="unknown")
    id = models.AutoField(primary_key=True)


class UserBalance(models.Model):
    username = models.CharField(max_length=100, unique=True)
    balance = models.FloatField(default=0.0)


class UserStock(models.Model):
    username = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10)
    price = models.FloatField()
    id = models.AutoField(primary_key=True)


class UserTransaction(models.Model):
    transaction_type = models.CharField(max_length=10)
    username = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10)
    amount = models.FloatField()
    price = models.FloatField()
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
