from django.urls import path, include
from rest_framework.routers import DefaultRouter

from profile_settings.api import views


app_name = "profile_api"

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r"social-links", views.SocialLinkModelViewSet)
router.register(r"education", views.EducationModelViewSet)
router.register(r"professional-skills", views.ProfessionalSkillHighlightModelViewSet)
router.register(r"technical-skills", views.TechnicalSkillHighlightModelViewSet)
router.register(r"services", views.ServiceModelViewSet)
router.register(r"testimonies", views.TestimonyModelViewSet)
router.register(r"email-settings", views.EmailAppModelViewSet)

work_router = DefaultRouter()
work_router.register(r"highlights", views.WorkHighlightModelViewSet)

skill_router = DefaultRouter()
skill_router.register(r"keywords", views.SkillKeywordModelViewSet)

pricing_router = DefaultRouter()
pricing_router.register(r"keywords", views.PricingKeywordModelViewSet)

urlpatterns = [
    path("me/", views.RetrieveMyProfile.as_view(), name="profile_retrieve_my-profile"),
    path("", views.ListCreateProfile.as_view(), name="profile_list_create_api"),
    path(
        "<int:pk>/",
        views.RetrieveUpdateDestroyProfile.as_view(),
        name="profile_retrieve_update_delete_api",
    ),
    path(
        "<int:profile_pk>/work/",
        views.ListCreateWork.as_view(),
        name="work_list_create_api",
    ),
    path(
        "<int:profile_pk>/work/<int:pk>/",
        views.RetrieveUpdateDestroyWork.as_view(),
        name="work_retrieve_update_destroy_api",
    ),
    path(
        "<int:profile_pk>/skills/",
        views.ListCreateSkill.as_view(),
        name="skill_list_create_api",
    ),
    path(
        "<int:profile_pk>/skills/<int:pk>/",
        views.RetrieveUpdateDestroySkill.as_view(),
        name="skill_retrieve_update_destroy_api",
    ),
    # path(
    #     "<int:profile_pk>/technical-skills/",
    #     views.ListTechnicalSkillHighlight.as_view(),
    #     name="technical-skills_list_api",
    # ),
    path(
        "<int:profile_pk>/pricing/",
        views.ListCreatePricing.as_view(),
        name="pricing_list_create_api",
    ),
    path(
        "<int:profile_pk>/pricing/<int:pk>/",
        views.RetrieveUpdateDestroyPricing.as_view(),
        name="pricing_retrieve_update_destroy_api",
    ),
    path("<int:profile_pk>/", include(router.urls)),
    path("<int:profile_pk>/work/<int:work_pk>/", include(work_router.urls)),
    path("<int:profile_pk>/skills/<int:skill_pk>/", include(skill_router.urls)),
    path("<int:profile_pk>/pricing/<int:pricing_pk>/", include(pricing_router.urls)),
]
