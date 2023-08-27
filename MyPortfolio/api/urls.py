from django.urls import path
from .views import (
    LoginAPIView,
)


urlpatterns = [
    path("auth/", LoginAPIView.as_view(), name="login_api"),
]
