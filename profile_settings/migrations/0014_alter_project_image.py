# Generated by Django 4.2.3 on 2023-09-26 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        (
            "profile_settings",
            "0013_alter_appsettings_options_alter_education_options_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="project",
            name="image",
            field=models.URLField(null=True),
        ),
    ]