from django.template import RequestContext, Template
from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
from django.http import HttpResponse
from django.utils import timezone


from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from jobs.models import JobSite, Job, Qualification, Attribute, JobApplication, Letter
from jobs.api.serializers import (
    JobSiteSerializer,
    JobSerializer,
    LetterSerializer,
    JobApplicationSerializer,
    RenderedLetterSerializer,
    JobApplicationViewSerializer,
)
from profile_settings.models import Profile
from MyPortfolio.api.exceptions import CustomException

from utils.scraper.job_sites import HTMLCrawler, JSONCrawler


class JobSiteModelViewSet(viewsets.ModelViewSet):
    queryset = JobSite.objects.all()
    serializer_class = JobSiteSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    @action(
        detail=True,
        methods=[
            "get",
        ],
        permission_classes=[IsAuthenticated],
    )
    def jobs(self, request, pk=None, **kwargs):
        job_site = self.get_object()

        return Response(
            JobSerializer(job_site.jobs, many=True).data,
            status=status.HTTP_200_OK,
        )

    @action(
        detail=True,
        methods=[
            "post",
        ],
        permission_classes=[IsAuthenticated],
    )
    def scrap(self, request, pk=None, **kwargs):
        job_site = self.get_object()

        jobs = []

        # Check if site is dynamic / static / API Endpoint
        # if job_site.site_type in ["static", "dynamic", "api_endpoints"]:

        if job_site.site_type == "api_endpoints":
            crawler = JSONCrawler(job_site)
        else:
            crawler = HTMLCrawler(job_site)

        job_data = crawler.crawl()
        for data in job_data:
            attributes = data.pop("attributes")
            qualifications = data.pop("qualifications")

            job, created = Job.objects.update_or_create(**data)

            if created:
                Attribute.objects.bulk_create(
                    Attribute(job=job, name=attribute) for attribute in attributes
                )

                Qualification.objects.bulk_create(
                    Qualification(job=job, name=qualification)
                    for qualification in qualifications
                )

            jobs.append(job)

        crawler.teardown()

        return Response(
            JobSerializer(jobs, many=True).data,
            status=status.HTTP_201_CREATED,
        )


class JobModelViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        return Job.objects.exclude(status="ARCHIVE")

    @action(
        detail=True,
        methods=[
            "get",
        ],
        permission_classes=[IsAuthenticated],
    )
    def applications(self, request, pk=None, **kwargs):
        job = self.get_object()

        return Response(
            JobApplicationSerializer(job.applications, many=True).data,
            status=status.HTTP_200_OK,
        )


class LetterModelViewSet(viewsets.ModelViewSet):
    queryset = Letter.objects.all()
    serializer_class = LetterSerializer
    permission_classes = [
        IsAuthenticated,
    ]


class RenderJobLetterViewSet(viewsets.ViewSet):
    """
    A ViewSet for retrieving letters rendered
     with job data.
    """

    permission_classes = [
        IsAuthenticated,
    ]

    def retrieve(self, request, job_pk=None, pk=None):
        job = Job.objects.filter(id=job_pk)  # self.kwargs["job_pk"])
        if job.exists():
            job = job[0]
        else:
            raise CustomException("Error: Job not Found")

        letter = Letter.objects.filter(id=pk)
        if letter.exists():
            letter = letter[0]
        else:
            raise CustomException("Error: Letter not Found")

        today = timezone.now()
        profile = Profile.objects.get(id=1)
        context = RequestContext(
            request, {"profile": profile, "job": job, "today": today}
        )
        text = Template(letter.text)
        rendered_text = text.render(context)

        serializer = RenderedLetterSerializer(
            {
                "id": letter.id,
                "name": letter.name,
                "text": rendered_text,
                "strip_tag_text": strip_tags(rendered_text),
            }
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class JobApplicationModelViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = JobApplicationViewSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        job = serializer.initial_data.get("job")
        job = Job.objects.filter(id=job)
        if job.exists():
            job = job[0]
            job.status = "APPLIED"
            job.save()
        else:
            raise CustomException("Error: Job not Found")

        letter = serializer.initial_data.get("letter")
        if letter:
            letter = Letter.objects.filter(id=letter)
            if letter.exists():
                letter = letter[0]

        profile = Profile.objects.get(id=1)

        serializer.save(job=job, letter=letter, cv=profile.cv_file)


class IframeLetterView(viewsets.ViewSet):
    permission_classes = [
        IsAuthenticated,
    ]

    def retrieve(self, request, pk=None):
        queryset = Letter.objects.all()
        letter = get_object_or_404(queryset, pk=pk)
        if letter:
            return HttpResponse(letter.text)

        return CustomException("Letter Error")


class RenderIframeLetterView(viewsets.ViewSet):
    permission_classes = [
        IsAuthenticated,
    ]
    """
    A ViewSet for retrieving letters rendered
     with job data.
    """

    def retrieve(self, request, job_pk=None, pk=None):
        job = Job.objects.filter(id=job_pk)
        if job.exists():
            job = job[0]
        else:
            raise CustomException("Error: Job not Found")

        letter = Letter.objects.filter(id=pk)
        if letter.exists():
            letter = letter[0]
        else:
            raise CustomException("Error: Letter not Found")

        today = timezone.now()
        profile = Profile.objects.get(id=1)
        context = RequestContext(
            request, {"profile": profile, "job": job, "today": today}
        )
        text = Template(letter.text)
        rendered_text = text.render(context)

        return HttpResponse(rendered_text)
