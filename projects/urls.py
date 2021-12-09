from django.urls import path

from . import views

urlpatterns = [
    path('', views.projects, name='projects'),
    path('project/', views.project, name='project'),
]