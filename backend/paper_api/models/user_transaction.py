from django.db import models


class UserTransaction(models.Model):
    transaction_type = models.CharField(max_length=10)
    username = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10)
    amount = models.FloatField()
    price = models.FloatField()
    id = models.AutoField(primary_key=True)
    date = models.DateTimeField(auto_now_add=True)
