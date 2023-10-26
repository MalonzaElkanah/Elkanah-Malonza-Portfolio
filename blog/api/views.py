from django.db.models import Q

from rest_framework import generics, viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView

from blog.models import (
    Article,
    ArticleCategory,
    ArticleSeries,
    Comment,
)
from blog.api.serializers import (
    ArticleSerializer,
    ArticleCategorySerializer,
    ArticleSeriesSerializer,
    CommentSerializer,
)
from blog.api.permissions import (
    IsOwnerArticleOrReadOnly,
)
from MyPortfolio.api.permissions import (
    IsOwnerOrReadOnly,
    IsAuthenticatedOrReadOnly,
    IsAuthenticatedOrPostOnly,
)
from MyPortfolio.api.exceptions import CustomException


class ListCreateArticle(generics.ListCreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
    ]
    filter_backends = [filters.SearchFilter]
    # filterset_fields = ['title',]
    search_fields = [
        "title",
        "tags",
        # 'content_text',
        "series__name",
        "category__name",
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

        article = Article(
            **serializer.validated_data,
            category=ArticleCategory.objects.get_or_create(
                **category_data, user=request.user
            )[0],
            user=request.user
        )

        if series:
            series = ArticleSeries.objects.get_or_create(
                name=serializer.validated_data.pop("series"), user=request.user
            )
            article.series = series

        article.save()

        return Response(
            self.get_serializer(article).data, status=status.HTTP_201_CREATED
        )


class RetrieveUpdateDestroyArticle(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsOwnerOrReadOnly]


class FeaturedArticlesAPIView(APIView):
    """
    View to list featured Article.

    *
    * All users are able to access this view.
    """

    def get(self, request, format=None):
        """
        Return a list of MOST viewed and LATEST Articles.
        """

        articles = Article.objects.filter(status="Publish")
        featured_articles = Article.objects.none()

        # 4 Featured Posts (2 latest, 2 Most Viewed)
        viewed_articles = articles.order_by("views").reverse()[0:2]
        latest_articles = articles.order_by("date_created").reverse()[0:2]

        featured_articles = featured_articles.union(
            viewed_articles, latest_articles
        ).order_by("views")

        data = ArticleSerializer(featured_articles, many=True).data

        return Response(data, status=status.HTTP_200_OK)


class ArticleCommentModelViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrPostOnly]

    def get_queryset(self):
        article = Article.objects.filter(id=self.kwargs["article_pk"])
        if not article.exists():
            raise CustomException("Error: Article not Found")

        return Comment.objects.filter(article=article[0].id)

    def perform_create(self, serializer):
        article = Article.objects.filter(id=self.kwargs["article_pk"])
        if not article.exists():
            raise CustomException("Error: Article not Found")

        serializer.save(article=article[0])


class ArticleCategoryViewset(viewsets.ModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    search_fields = None
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=True, methods=["get"], permission_classes=[IsAuthenticatedOrReadOnly]
    )
    def articles(self, request, pk=None, **kwargs):
        instance = self.get_object().articles.filter(status="Publish")

        search = self.request.query_params.get("search")

        if search is not None:
            articles = Article.objects.none()
            articles = articles.union(
                instance.filter(title__icontains=str(search)),
                instance.filter(tags__icontains=str(search)),
                instance.filter(series__name__icontains=str(search)),
                instance.filter(category__name__icontains=str(search)),
            )
        else:
            articles = instance

        return Response(
            ArticleSerializer(articles, many=True).data,
            status=status.HTTP_200_OK,
        )


class ArticleSeriesViewset(viewsets.ModelViewSet):
    queryset = ArticleSeries.objects.all()
    serializer_class = ArticleSeriesSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(
        detail=True,
        methods=["get"],
        permission_classes=[IsAuthenticatedOrReadOnly],
    )
    def articles(self, request, pk=None, **kwargs):
        instance = self.get_object().articles.filter(status="Publish")

        search = self.request.query_params.get("search")

        if search is not None:
            articles = Article.objects.none()
            articles = articles.union(
                instance.filter(title__icontains=str(search)),
                instance.filter(tags__icontains=str(search)),
                instance.filter(series__name__icontains=str(search)),
                instance.filter(category__name__icontains=str(search)),
            )
        else:
            articles = instance

        return Response(
            ArticleSerializer(articles, many=True).data,
            status=status.HTTP_200_OK,
        )


class CommentModelViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerArticleOrReadOnly]
