# Generated by Django 2.0.2 on 2018-03-21 03:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='logs',
            name='ip',
            field=models.GenericIPAddressField(),
        ),
    ]