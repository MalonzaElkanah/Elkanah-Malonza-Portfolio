# Generated by Django 3.1.7 on 2021-12-16 13:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20211216_1346'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='views',
            field=models.IntegerField(blank=True, default=0, null=True, verbose_name='Views'),
        ),
    ]
