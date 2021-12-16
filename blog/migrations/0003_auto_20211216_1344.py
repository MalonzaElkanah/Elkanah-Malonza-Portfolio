# Generated by Django 3.1.7 on 2021-12-16 13:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_comment_commentreply'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='series',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='blog.articleseries'),
        ),
        migrations.AlterField(
            model_name='article',
            name='views',
            field=models.IntegerField(default=0, verbose_name='Views'),
        ),
    ]
