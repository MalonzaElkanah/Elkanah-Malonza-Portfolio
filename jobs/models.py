from django.db import models
from django.utils.html import strip_tags

from urllib.parse import urlparse


class JobSite(models.Model):
    SITE_TYPE = (
        ("static", "static"),
        ("dynamic", "dynamic"),
        ("api_endpoints", "api_endpoints"),
    )

    site_name = models.CharField("Site Name", max_length=200)
    job_list_link = models.URLField("Job List Link")
    job_link_element = models.CharField("Job Link Element", max_length=100)
    site_type = models.CharField(
        "Site TYpe", max_length=15, choices=SITE_TYPE, default="static"
    )

    name_element = models.CharField(
        "Job Name Element", max_length=100, null=True, blank=True
    )
    experience_element = models.CharField(
        "Job Experience Element", max_length=100, null=True, blank=True
    )
    description_element = models.CharField(
        "Job Description Element", max_length=100, null=True, blank=True
    )
    organization_element = models.CharField(
        "Job Organization Element", max_length=100, null=True, blank=True
    )
    address_element = models.CharField(
        "Job Address Element", max_length=100, null=True, blank=True
    )
    qualification_element = models.CharField(
        "Job Qualification Element", max_length=100, null=True, blank=True
    )
    attribute_element = models.CharField(
        "Job Attribute Element", max_length=100, null=True, blank=True
    )
    deadline_element = models.CharField(
        "Job Deadline Element", max_length=100, null=True, blank=True
    )

    date_created = models.DateTimeField("Date Created", auto_now_add=True)

    def __str__(self):
        return self.site_name

    class Meta:
        ordering = ["-date_created"]

    @property
    def link_domain(self):
        url = self.job_list_link
        return urlparse(url).netloc

    @property
    def job_count(self):
        return self.jobs.count()

    @property
    def applied_job_count(self):
        return self.jobs.filter(status="APPLIED").count()


class Job(models.Model):
    STATUS = (
        ("ARCHIVE", "ARCHIVE"),
        ("APPLIED", "APPLIED"),
        ("NOT_APPLIED", "NOT_APPLIED"),
    )
    job_site = models.ForeignKey(
        JobSite, related_name="jobs", on_delete=models.SET_NULL, null=True
    )
    name = models.CharField("Name", max_length=500)
    experience = models.CharField("Experience", max_length=600, null=True, blank=True)
    description = models.TextField("Description", null=True)
    organization = models.CharField(
        "Organization", max_length=800, null=True, blank=True
    )
    address = models.TextField("Address")
    status = models.CharField(
        "Status", max_length=20, choices=STATUS, default="NOT_APPLIED"
    )
    deadline = models.CharField("Deadline", max_length=700)
    link = models.CharField("Link", max_length=1000, null=True, blank=True)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # job_site, name, experience, description, organization, address, status, deadline, link

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("-date_created",)


class Qualification(models.Model):
    job = models.ForeignKey(
        Job, related_name="qualifications", on_delete=models.CASCADE
    )
    name = models.CharField("Qualification", max_length=500)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("id",)


class Attribute(models.Model):
    job = models.ForeignKey(Job, related_name="attributes", on_delete=models.CASCADE)
    name = models.CharField("Attribute", max_length=500)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("id",)


class Letter(models.Model):
    name = models.CharField("Letter Name", max_length=50)
    file = models.URLField(null=True)
    text = models.TextField(null=True)
    description = models.TextField(null=True)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # name, file, text, description, date_created,

    class Meta:
        ordering = ("id",)

    def __str__(self):
        return self.name

    @property
    def strip_tag_text(self):
        if self.text:
            return strip_tags(self.text)
        return ""


class JobApplication(models.Model):
    STATUS = (
        ("WAITING", "WAITING"),
        ("FAILED", "FAILED"),
        ("SUCCESS", "SUCCESS"),
    )

    job = models.ForeignKey(Job, related_name="applications", on_delete=models.CASCADE)
    cv = models.URLField(null=True)
    cover_letter = models.TextField(null=True)
    application_type = models.CharField("Application Method", max_length=200)
    status = models.CharField("Status", choices=STATUS, max_length=200, default="WAIT")
    letter = models.ForeignKey(Letter, on_delete=models.SET_NULL, null=True, blank=True)
    feedback = models.CharField("Feedback", max_length=500, null=True)
    feedback_type = models.CharField("Feedback Type", max_length=50, null=True)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # job, cv, cover_letter, application_type, status, letter, date_created
    # feedback, feedback_type

    class Meta:
        ordering = ("id",)
