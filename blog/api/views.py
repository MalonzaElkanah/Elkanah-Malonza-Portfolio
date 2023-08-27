from django.db.models import Q

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from blog.models import Article, ArticleCategory, ArticleSeries
from blog.api.serializers import (
    ArticleSerializer,
    ArticleCategorySerializer,
    ArticleSeriesSerializer,
)
from MyPortfolio.api.permissions import (
    IsOwnerOrReadOnly,
    IsAuthenticatedOrReadOnly,
)


class ListCreateArticle(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def get_queryset(self):
        """
        List Articles all articles if authenticated else
        list  Published Articles
        """
        if self.request.user.is_authenticated:
            return Article.objects.filter(
                Q(user=self.request.user.id) | Q(status="Publish")
            )

        return Article.objects.filter(status="Publish")

    def post(self, request, format=None):
        """
        Add authenticated user before save
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category_data = serializer.validated_data.pop("category")
        series = serializer.validated_data.get("series", None)

        if series:
            series = ArticleSeries.objects.get_or_create(
                name=serializer.validated_data.pop("category"), user=request.user
            )

        article = Article(
            **serializer.validated_data,
            category=ArticleCategory.objects.get_or_create(
                **category_data, user=request.user
            )[0],
            user=request.user
        )
        article.save()

        return Response(
            self.get_serializer(article).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyArticle(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsOwnerOrReadOnly]


class ListCreateArticleCategory(generics.ListCreateAPIView):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = ArticleCategory(**serializer.validated_data, user=request.user)
        category.save()

        return Response(
            self.get_serializer(category).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyArticleCategory(generics.RetrieveUpdateDestroyAPIView):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]


class ListCreateArticleSeries(generics.ListCreateAPIView):
    queryset = ArticleSeries.objects.all()
    serializer_class = ArticleSeriesSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = ArticleSeries(**serializer.validated_data, user=request.user)
        category.save()

        return Response(
            self.get_serializer(category).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyArticleSeries(generics.RetrieveUpdateDestroyAPIView):
    queryset = ArticleSeries.objects.all()
    serializer_class = ArticleSeriesSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
