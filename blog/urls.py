from django.urls import path, re_path

from . import views

urlpatterns = [
    path("", views.blog, name="blog"),
    path("post/<slug:slug>/<int:article_id>/", views.article, name="article"),
    path(
        "posts/category/<slug:slug>/<int:category_id>/",
        views.articles_category,
        name="articles-category",
    ),
    path(
        "posts/series/<slug:slug>/<int:series_id>/",
        views.articles_series,
        name="articles-series",
    ),
    re_path(
        r"^posts/archives/(?P<slug>[\w-]+)/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$",
        views.articles_archives,
        name="articles-archives",
    ),
    path("posts/", views.articles, name="articles"),
    path("posts/search/", views.articles_search, name="articles-search"),
    path(
        "comment/post/<slug:slug>/<int:article_id>/",
        views.comment_article,
        name="comment-article",
    ),
]
