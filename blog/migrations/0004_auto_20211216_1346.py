# Generated by Django 3.1.7 on 2021-12-16 13:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_auto_20211216_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='views',
            field=models.IntegerField(default=0, null=True, verbose_name='Views'),
        ),
    ]
