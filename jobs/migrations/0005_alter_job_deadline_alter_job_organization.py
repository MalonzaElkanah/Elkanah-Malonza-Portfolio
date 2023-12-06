# Generated by Django 4.2.3 on 2023-12-03 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("jobs", "0004_alter_job_deadline_alter_job_organization"),
    ]

    operations = [
        migrations.AlterField(
            model_name="job",
            name="deadline",
            field=models.CharField(max_length=400, verbose_name="Deadline"),
        ),
        migrations.AlterField(
            model_name="job",
            name="organization",
            field=models.CharField(
                blank=True, max_length=800, null=True, verbose_name="Organization"
            ),
        ),
    ]