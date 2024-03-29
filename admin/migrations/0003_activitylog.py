# Generated by Django 4.2.3 on 2023-10-13 04:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("admin", "0002_uploadfile"),
    ]

    operations = [
        migrations.CreateModel(
            name="ActivityLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("request_url", models.URLField(max_length=1000)),
                ("request_method", models.CharField(max_length=10)),
                ("response_code", models.CharField(max_length=3)),
                ("datetime", models.DateTimeField(default=django.utils.timezone.now)),
                ("device", models.CharField(blank=True, max_length=1000, null=True)),
                ("browser", models.CharField(blank=True, max_length=1000, null=True)),
                ("os", models.CharField(blank=True, max_length=1000, null=True)),
                ("extra_data", models.TextField(blank=True, null=True)),
                ("ip_address", models.GenericIPAddressField(blank=True, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ("id",),
            },
        ),
    ]
