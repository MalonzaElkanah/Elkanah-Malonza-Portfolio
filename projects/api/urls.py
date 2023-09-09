from django.urls import path, include
from rest_framework.routers import DefaultRouter

from projects.api import views


app_name = "project_api"

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"keywords", views.ProjectKeywordViewSet)
router.register(r"images", views.ProjectImageModelViewSet)


urlpatterns = [
    path("", views.ListCreateProject.as_view(), name="project_list_create_api"),
    path(
        "<int:pk>/",
        views.RetrieveUpdateDestroyProject.as_view(),
        name="project_retrieve_update_delete_api",
    ),
    path("keywords/", views.ListKeywords.as_view(), name="keywords_list_api"),
    path(
        "keywords/<slug:slug>/projects/",
        views.ListKeywordProjects.as_view(),
        name="keywords_projects_list_api",
    ),
    path("<int:project_pk>/", include(router.urls)),
]
