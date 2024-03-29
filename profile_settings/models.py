from django.db import models
from django.utils.html import strip_tags
from django.contrib.auth.models import User

# Create your models here.

import django.utils.timezone as tz
from gdstorage.storage import GoogleDriveStorage

from blog.models import Article


# Define Google Drive Storage
gd_storage = GoogleDriveStorage()


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.URLField()
    cv_file = models.URLField(null=True)
    first_name = models.CharField("First Name", max_length=50)
    second_name = models.CharField("Second Name", max_length=50)
    email_1 = models.CharField("Email 1", max_length=50)
    email_2 = models.CharField("Email 2", max_length=50, null=True)
    phone_number_1 = models.CharField("Phone Number 1", max_length=50)
    phone_number_2 = models.CharField("Phone Number 2", max_length=50)
    description = models.CharField("Description", max_length=1000, null=True)
    address = models.CharField("Address", max_length=50)
    # user, image, first_name, second_name, email_1, email_2, phone_number_1,
    # phone_number_2, description, address

    class Meta:
        ordering = ["id"]

    @property
    def technical_skills(self):
        return TechnicalSkillHighlight.objects.filter(
            skill_keyword__skill__profile=self.id
        )

    @property
    def project_highlights(self):
        # 4 Recent Projects
        return Project.objects.filter(profile=self.id).order_by("date").reverse()[0:4]

    @property
    def article_highlights(self):
        # 3 Recent Articles
        return (
            Article.objects.filter(status="Publish")
            .order_by("date_created")
            .reverse()[0:3]
        )

    def socials(self):
        return SocialLink.objects.filter(profile=self.id)


class Project(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="projects", on_delete=models.CASCADE
    )
    # image = models.ImageField(
    #    upload_to="image/project/",
    #    max_length=1000,
    #    default="image/project/project.jpg",
    #    storage=gd_storage,
    # )
    image = models.URLField(null=True)
    name = models.CharField("Projects", max_length=200)
    description = models.TextField()
    url = models.URLField(null=True)
    video_url = models.URLField(null=True, blank=True)
    date = models.DateField(default=tz.now)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, name, description, url, date

    class Meta:
        ordering = ["-date"]

    def keywords(self):
        return ProjectKeyword.objects.filter(project=self.id)

    def images(self):
        return ProjectImage.objects.filter(project=self.id)

    def highlight_keywords(self):
        return ProjectKeyword.objects.filter(project=self.id)[0:7]

    @property
    def description_text(self):
        return strip_tags(self.description)


class ProjectKeyword(models.Model):
    project = models.ForeignKey(
        Project, related_name="keywords", on_delete=models.CASCADE
    )
    technology = models.CharField("Technology", max_length=50)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # project, technology,

    class Meta:
        unique_together = ["project", "technology"]
        ordering = ["id"]

    def __str__(self):
        return self.technology


class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, related_name="images", on_delete=models.CASCADE
    )
    picture = models.ImageField(
        upload_to="image/project/multiple/", max_length=1000, storage=gd_storage
    )
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # project, image,

    class Meta:
        unique_together = ["project", "picture"]
        ordering = ["id"]


class SocialLink(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="social_links", on_delete=models.CASCADE
    )
    name = models.CharField("Website Name", max_length=50)
    logo = models.CharField("Logo", max_length=50)
    url = models.URLField()
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, name, logo, url

    class Meta:
        unique_together = ["profile", "name"]
        ordering = ["id"]


class Education(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="education", on_delete=models.CASCADE
    )
    institution = models.CharField("Institution", max_length=200)
    location = models.CharField("Location", max_length=50)
    study_area = models.CharField("Major", max_length=200)
    study_type = models.CharField("Field", max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    gpa = models.CharField("GPA", max_length=50)
    description = models.CharField("Description", max_length=1200)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, institution, location, study_area, study_type, start_date, end_date, gpa,
    # description

    class Meta:
        ordering = ["-start_date"]


class Work(models.Model):
    profile = models.ForeignKey(Profile, related_name="work", on_delete=models.CASCADE)
    company = models.CharField("Company", max_length=50)
    location = models.CharField("Location", max_length=50)
    position = models.CharField("Position", max_length=50)
    website = models.URLField("Website", null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, company, location, position, website, start_date, end_date

    class Meta:
        ordering = ["-start_date"]

    def highlights(self):
        return WorkHighlight.objects.filter(work=self.id)


class WorkHighlight(models.Model):
    work = models.ForeignKey(Work, related_name="highlights", on_delete=models.CASCADE)
    name = models.CharField("Highlight", max_length=500)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # work, name,

    class Meta:
        unique_together = ["work", "name"]
        ordering = ["id"]

    def __str__(self):
        return self.name


class Skill(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="skills", on_delete=models.CASCADE
    )
    name = models.CharField("Skill", max_length=200)
    description = models.CharField("Description", max_length=1000)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, name, description

    class Meta:
        unique_together = ["profile", "name"]
        ordering = ["id"]

    def keywords(self):
        return SkillKeyword.objects.filter(skill=self.id)


class SkillKeyword(models.Model):
    skill = models.ForeignKey(Skill, related_name="keywords", on_delete=models.CASCADE)
    name = models.CharField("Keyword", max_length=200)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # skill, name,

    class Meta:
        unique_together = ["skill", "name"]
        ordering = ["id"]

    def __str__(self):
        return self.name


class TechnicalSkillHighlight(models.Model):
    skill_keyword = models.ForeignKey(
        SkillKeyword, related_name="highlights", on_delete=models.CASCADE
    )
    percentage = models.IntegerField("Percentage", default=0)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # skill_keyword, percentage

    class Meta:
        unique_together = ["skill_keyword", "percentage"]
        ordering = ["id"]


class ProfessionalSkillHighlight(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="professional_skills", on_delete=models.CASCADE
    )
    name = models.CharField("Name", max_length=50)
    percentage = models.IntegerField("Percentage", default=0)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)

    class Meta:
        unique_together = ["profile", "name"]
        ordering = ["id"]


class Service(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="services", on_delete=models.CASCADE
    )
    logo = models.CharField(
        "Favicon Logo", max_length=200, default="fas fa-object-group"
    )
    name = models.CharField("Service", max_length=200)
    description = models.CharField("Description", max_length=1000)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, logo, name, description

    class Meta:
        unique_together = ["profile", "name"]
        ordering = ["id"]


class Testimony(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="testimonies", on_delete=models.CASCADE
    )
    image = models.ImageField(
        upload_to="image/profile/",
        max_length=1000,
        default="image/profile/default_profile.jpg",
        storage=gd_storage,
    )
    testimony = models.CharField("Testimony", max_length=5000)
    name = models.CharField("Name", max_length=50)
    title = models.CharField("Title", max_length=150)
    link = models.URLField(null=True)

    class Meta:
        unique_together = ["profile", "testimony"]
        ordering = ["id"]


class Pricing(models.Model):
    profile = models.ForeignKey(
        Profile, related_name="pricing", on_delete=models.CASCADE
    )
    price = models.FloatField("Price")
    name = models.CharField("Name", max_length=200)
    description = models.CharField("Description", max_length=1000)
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # profile, price, name, description

    class Meta:
        unique_together = ["profile", "name"]
        ordering = ["id"]

    def keywords(self):
        return PricingKeyword.objects.filter(pricing=self.id)


class PricingKeyword(models.Model):
    pricing = models.ForeignKey(
        Pricing, related_name="keywords", on_delete=models.CASCADE
    )
    name = models.CharField("Keyword", max_length=200)
    status = models.CharField("Status", max_length=200, default="ACTIVE")
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # pricing, name, status

    class Meta:
        unique_together = ["pricing", "name"]
        ordering = ["id"]

    def __str__(self):
        return self.name


class Message(models.Model):
    first_name = models.CharField("First Name", max_length=50)
    last_name = models.CharField("Last Name", max_length=50, null=True, blank=True)
    email = models.CharField("Email", max_length=50)
    message = models.CharField("Message", max_length=1500)
    status = models.CharField("Status", max_length=50, default="unsend")
    date_created = models.DateTimeField("Date Created", auto_now_add=True)
    # first_name, last_name, email, message, status

    class Meta:
        ordering = ["-date_created"]


class EmailApp(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    smtp_server = models.CharField("SMTP SERVER", max_length=100)
    port = models.IntegerField("Port", default=587)
    email = models.CharField(
        "App Email", max_length=100, default="malonetechnologies101.com"
    )
    password = models.CharField("Password", max_length=200)
    # profile, smtp_server, port, email, password

    class Meta:
        unique_together = ["profile", "email"]
        ordering = ["id"]


class AppSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    app_name = models.CharField("App Name", max_length=20)
    logo = models.ImageField(
        "Logo",
        upload_to="Image/Settings/Logo",
        default="logo.png",
        blank=True,
        null=True,
        storage=gd_storage,
    )
    favicon = models.ImageField(
        "Favicon",
        upload_to="Image/Settings/Logo",
        default="favicon.ico",
        blank=True,
        null=True,
        storage=gd_storage,
    )
    layout = models.CharField("layout", max_length=10)
    sidebar_color = models.CharField("Sidebar Color", max_length=10)
    color_theme = models.CharField("Color Theme", max_length=10)
    mini_sidebar = models.CharField("Mini Sidebar", max_length=10)
    sticky_header = models.CharField("Sticky Header", max_length=10)
    # user, app_name, logo, favicon, layout,
    # sidebar_color, color_theme, mini_sidebar, sticky_header

    class Meta:
        unique_together = ["user", "app_name"]
        ordering = ["id"]

    def layout_class(self):
        layout = self.layout
        if layout == "1":
            return "light"
        elif layout == "2":
            return "dark"
        else:
            return "dark"

    def sidebar_color_class(self):
        sidebar_color = self.sidebar_color
        if sidebar_color == "1":
            return "light-sidebar"
        elif sidebar_color == "2":
            return "dark-sidebar"
        else:
            return "light-sidebar"

    def color_theme_class(self):
        color_theme = self.color_theme
        if color_theme == "white":
            return "theme-white"
        elif color_theme == "cyan":
            return "theme-cyan"
        elif color_theme == "black":
            return "theme-black"
        elif color_theme == "purple":
            return "theme-purple"
        elif color_theme == "orange":
            return "theme-orange"
        elif color_theme == "green":
            return "theme-green"
        elif color_theme == "red":
            return "theme-red"
        else:
            return "theme-white"

    def mini_sidebar_class(self):
        mini_sidebar = self.mini_sidebar
        if mini_sidebar == "false":
            return " "
        elif mini_sidebar == "true":
            return "sidebar-mini"
        else:
            return " "

    def sticky_header_class(self):
        sticky_header = self.sticky_header
        if sticky_header == "false":
            return "sticky"
        elif sticky_header == "true":
            return " "
            pass
        else:
            return " "
