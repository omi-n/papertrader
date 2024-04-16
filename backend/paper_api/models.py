from django.db import models


# Create your models here.
class Ticker(models.Model):
    ticker = models.CharField(max_length=10)
    api = models.CharField(max_length=10)
