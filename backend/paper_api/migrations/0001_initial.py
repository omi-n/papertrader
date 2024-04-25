# Generated by Django 5.0.4 on 2024-04-25 21:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ticker',
            fields=[
                ('ticker', models.CharField(max_length=10, unique=True)),
                ('name', models.CharField(default='unknown', max_length=100)),
                ('country', models.CharField(default='unknown', max_length=50)),
                ('industry', models.CharField(default='unknown', max_length=100)),
                ('sector', models.CharField(default='unknown', max_length=50)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
    ]
