# Generated by Django 3.1.7 on 2021-12-16 05:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("profile_settings", "0003_auto_20211215_1530"),
    ]

    operations = [
        migrations.AddField(
            model_name="service",
            name="logo",
            field=models.CharField(
                default="fas fa-object-group",
                max_length=200,
                verbose_name="Favicon Logo",
            ),
        ),
    ]
