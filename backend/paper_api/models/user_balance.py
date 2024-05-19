from django.db import models


class UserBalance(models.Model):
    username = models.CharField(max_length=100, unique=True)
    balance = models.FloatField(default=0.0)
