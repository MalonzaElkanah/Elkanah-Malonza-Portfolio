from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin.api import views


app_name = "admin"

# Create a router and register our viewsets with it.
admin_router = DefaultRouter()
admin_router.register(r"messages", views.MessageModelViewSet)
admin_router.register(r"app-settings", views.AppSettingsModelViewSet)

urlpatterns = [
    path("", include(admin_router.urls)),
]
