from django.urls import path

from . import views

urlpatterns = [
    path('', views.projects, name='projects'),
    path('project/<slug:slug>/<int:project_id>/', views.project, name='project'),
    path('technology/<slug:slug>/', views.project_technology, name='project-technology'),
]