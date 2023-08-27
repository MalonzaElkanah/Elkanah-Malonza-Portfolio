from django.urls import path

from blog.api import views


app_name = "blog_api"

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
        "categories/",
        views.ListCreateArticleCategory.as_view(),
        name="blog_category_list_create_api",
    ),
    path(
        "categories/<int:pk>/",
        views.RetrieveUpdateDestroyArticleCategory.as_view(),
        name="blog_category_retrieve_update_delete_api",
    ),
    path(
        "series/",
        views.ListCreateArticleSeries.as_view(),
        name="blog_series_list_create_api",
    ),
    path(
        "series/<int:pk>/",
        views.RetrieveUpdateDestroyArticleSeries.as_view(),
        name="blog_series_retrieve_update_delete_api",
    ),
]
