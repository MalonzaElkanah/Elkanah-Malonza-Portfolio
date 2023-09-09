from django.urls import path, include
from rest_framework.routers import DefaultRouter

from blog.api import views


app_name = "blog_api"

# Create a router and register our viewsets with it.
blog_router = DefaultRouter()
blog_router.register(r"categories", views.ArticleCategoryViewset)
blog_router.register(r"series", views.ArticleSeriesViewset)
blog_router.register(r"comments", views.CommentModelViewSet)

article_router = DefaultRouter()
article_router.register(r"comments", views.ArticleCommentModelViewSet)


urlpatterns = [
    path(
        "articles/", views.ListCreateArticle.as_view(), name="article_list_create_api"
    ),
    path(
        "articles/<int:pk>/",
        views.RetrieveUpdateDestroyArticle.as_view(),
        name="article_retrieve_update_delete_api",
    ),
    path(
        "articles/featured/",
        views.FeaturedArticlesAPIView.as_view(),
        name="featured_articles_list_api",
    ),
    path("", include(blog_router.urls)),
    path("articles/<int:article_pk>/", include(article_router.urls)),
]
