from django.urls import path, include
from rest_framework.routers import DefaultRouter

from admin.api import views


app_name = "admin"

# Create a router and register our viewsets with it.
admin_router = DefaultRouter()
admin_router.register(r"messages", views.MessageModelViewSet)
admin_router.register(r"app-settings", views.AppSettingsModelViewSet)
admin_router.register(r"upload-image", views.UploadImageModelViewSet)
admin_router.register(r"upload-file", views.UploadFileModelViewSet)

urlpatterns = [
    path(
        "change-password/",
        views.ChangePasswordAPIView.as_view(),
        name="change-password",
    ),
    path("activity-logs/", views.ListActivityLogs.as_view(), name="activity_log_list"),
    path("", include(admin_router.urls)),
]
