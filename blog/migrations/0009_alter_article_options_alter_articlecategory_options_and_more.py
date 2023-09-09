# Generated by Django 4.2.3 on 2023-09-09 19:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0008_alter_articlecategory_name_alter_articleseries_name"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="article",
            options={"ordering": ["id"]},
        ),
        migrations.AlterModelOptions(
            name="articlecategory",
            options={"ordering": ["id"]},
        ),
        migrations.AlterModelOptions(
            name="articleseries",
            options={"ordering": ["id"]},
        ),
        migrations.AlterModelOptions(
            name="comment",
            options={"ordering": ["id"]},
        ),
        migrations.AlterModelOptions(
            name="commentreply",
            options={"ordering": ["id"]},
        ),
        migrations.AlterField(
            model_name="article",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="articles",
                to="blog.articlecategory",
            ),
        ),
        migrations.AlterField(
            model_name="article",
            name="series",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="articles",
                to="blog.articleseries",
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="article",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="comments",
                to="blog.article",
            ),
        ),
        migrations.AlterField(
            model_name="comment",
            name="message",
            field=models.CharField(max_length=1200, verbose_name="Message"),
        ),
        migrations.AlterField(
            model_name="comment",
            name="name",
            field=models.CharField(max_length=200, verbose_name="Name"),
        ),
        migrations.AlterField(
            model_name="commentreply",
            name="comment",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="replies",
                to="blog.comment",
            ),
        ),
        migrations.AlterField(
            model_name="commentreply",
            name="message",
            field=models.CharField(max_length=1200, verbose_name="Message"),
        ),
        migrations.AlterField(
            model_name="commentreply",
            name="name",
            field=models.CharField(max_length=200, verbose_name="Name"),
        ),
    ]
