from rest_framework import serializers

from blog.models import (
    Article,
    ArticleCategory,
    ArticleSeries,
    Comment,
    CommentReply,
)
from MyPortfolio.api.serializers import UserProfileSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        exclude = [
            "user",
        ]

        extra_kwargs = {"name": {"required": True, "validators": []}}


class SeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleSeries
        exclude = [
            "user",
        ]

        extra_kwargs = {"name": {"required": True, "validators": []}}


class CommentReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentReply
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    replies = CommentReplySerializer(read_only=True, many=True)

    class Meta:
        model = Comment
        fields = "__all__"


class ArticleSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    series = SeriesSerializer()
    user = UserProfileSerializer(read_only=True)
    comments = CommentSerializer(read_only=True, many=True)

    class Meta:
        model = Article
        fields = "__all__"
        extra_kwargs = {
            "views": {"read_only": False, "required": False},
            "image": {"required": False},
        }

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "category":
                instance.category = ArticleCategory.objects.get_or_create(
                    **value, user=instance.user
                )[0]
            elif attr == "series":
                instance.series = ArticleSeries.objects.get_or_create(
                    **value, user=instance.user
                )[0]
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        exclude = [
            "user",
        ]


class ArticleSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleSeries
        exclude = [
            "user",
        ]
