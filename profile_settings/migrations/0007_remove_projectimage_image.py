# Generated by Django 3.1.7 on 2021-12-21 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("profile_settings", "0006_auto_20211221_0950"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="projectimage",
            name="image",
        ),
    ]
