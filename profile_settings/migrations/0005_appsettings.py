# Generated by Django 3.1.7 on 2021-12-17 06:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('profile_settings', '0004_service_logo'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('app_name', models.CharField(max_length=20, verbose_name='App Name')),
                ('logo', models.ImageField(blank=True, default='logo.png', null=True, upload_to='Image/Settings/Logo', verbose_name='Logo')),
                ('favicon', models.ImageField(blank=True, default='favicon.ico', null=True, upload_to='Image/Settings/Logo', verbose_name='Favicon')),
                ('layout', models.CharField(max_length=10, verbose_name='layout')),
                ('sidebar_color', models.CharField(max_length=10, verbose_name='Sidebar Color')),
                ('color_theme', models.CharField(max_length=10, verbose_name='Color Theme')),
                ('mini_sidebar', models.CharField(max_length=10, verbose_name='Mini Sidebar')),
                ('sticky_header', models.CharField(max_length=10, verbose_name='Sticky Header')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]