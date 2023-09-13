"""MyPortfolio URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

from rest_framework.authtoken import views as authtoken_views
from rest_framework.schemas import get_schema_view

from . import views


schema_view = get_schema_view(
    title="Portfolio APIs",
    description="API Docs for Portfolio APIs",
    url="https://elkanahmalonza.pythonanywhere.com/",
    version="1.0.0",
)

urlpatterns_v1 = [
    path("auth/", include("rest_framework.urls")),
    path("token-auth/", authtoken_views.obtain_auth_token, name="api-token"),
    path("", schema_view),
    path("blog/", include("blog.api.urls")),
    path("", include("admin.api.urls")),
    path("projects/", include("projects.api.urls")),
    path("profile/", include("profile_settings.api.urls")),
]

# versions from the Apis(v1,v2)
apiversions_urlsparterns = [
    path("v1/", include(urlpatterns_v1)),
]

urlpatterns = [
    path("admin/", include("admin.urls")),
    path("blog/", include("blog.urls")),
    path("projects/", include("projects.urls")),
    path("", views.index, name="index"),
    path("contact-me/", views.contact_me, name="contact-me"),
    path("login/", views.auth_login, name="login"),
    path("logout/", views.auth_logout, name="logout"),
    # api urls
    path("api/", include(apiversions_urlsparterns)),
]

urlpatterns += staticfiles_urlpatterns()

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
