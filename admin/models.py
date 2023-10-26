from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

from gdstorage.storage import GoogleDriveStorage


# Define Google Drive Storage
gd_storage = GoogleDriveStorage()


class UploadImage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="images", max_length=1000, storage=gd_storage)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)

    @property
    def path(self):
        return self.image.url


class UploadFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to="images", max_length=1000, storage=gd_storage)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)

    @property
    def path(self):
        return self.file.url


class ActivityLog(models.Model):
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    request_url = models.URLField(max_length=1000)
    request_method = models.CharField(max_length=10)
    response_code = models.CharField(max_length=3)
    datetime = models.DateTimeField(default=timezone.now)
    device = models.CharField(max_length=1000, null=True, blank=True)
    browser = models.CharField(max_length=1000, null=True, blank=True)
    os = models.CharField(max_length=1000, null=True, blank=True)
    extra_data = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ("-datetime",)
