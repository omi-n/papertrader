from django.db import models


class UserStock(models.Model):
    username = models.CharField(max_length=100)
    ticker = models.CharField(max_length=10)
    price = models.FloatField()
    id = models.AutoField(primary_key=True)
