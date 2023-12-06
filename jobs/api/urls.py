from django.urls import path, include
from rest_framework.routers import DefaultRouter

from jobs.api import views


app_name = "jobs"

# Create a router and register our viewsets with it.
job_router = DefaultRouter()
job_router.register(r"jobs", views.JobModelViewSet)
job_router.register(r"job-sites", views.JobSiteModelViewSet)
job_router.register(r"letters", views.LetterModelViewSet)
# job_router.register(r"letter", views.IframeLetterView, basename="letter_template")
job_router.register(r"job-applications", views.JobApplicationModelViewSet)

job_letter_router = DefaultRouter()
job_letter_router.register(
    "render-letter", views.RenderJobLetterViewSet, basename="job_letters"
)
# job_letter_router.register(
#     "render-letter-template",
#     views.RenderIframeLetterView,
#     basename="job_letters_template"
# )

urlpatterns = [
    path("", include(job_router.urls)),
    path("jobs/<int:job_pk>/", include(job_letter_router.urls)),
]
