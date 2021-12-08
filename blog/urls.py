from django.urls import path

from . import views

urlpatterns = [
    path('', views.blog, name='blog'),
    path('post/', views.article, name='article'),
    path('posts/', views.articles, name='articles'),
]
