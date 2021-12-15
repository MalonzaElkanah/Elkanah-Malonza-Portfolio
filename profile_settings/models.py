from django.db import models
from django.contrib.auth.models import User

# Create your models here.

import django.utils.timezone as tz


class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	image = models.ImageField(upload_to='image/profile/', max_length=1000, 
		default='image/profile/default_profile.jpg')
	first_name = models.CharField('First Name', max_length=50)
	second_name = models.CharField('Second Name', max_length=50)
	email_1 = models.CharField('Email 1', max_length=50)
	email_2 = models.CharField('Email 2', max_length=50, null=True)
	phone_number_1 = models.CharField('Phone Number 1', max_length=50)
	phone_number_2 = models.CharField('Phone Number 2', max_length=50)
	description = models.CharField('Description', max_length=1000, null=True)
	address = models.CharField('Address', max_length=50)
	# user, image, first_name, second_name, email_1, email_2, phone_number_1, 
	# phone_number_2, description, address


class Project(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	image = models.ImageField(upload_to='image/project/', max_length=1000, 
		default='image/project/default_profile.jpg')
	name = models.CharField('Projects', max_length=200)
	description = models.TextField()
	url = models.URLField(null=True)
	date = models.DateField(default=tz.now)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, name, description, url, date

	def keywords(self):
		return ProjectKeyword.objects.filter(project=self.id)

	def highlight_keywords(self):
		return ProjectKeyword.objects.filter(project=self.id)[0:7]


class ProjectKeyword(models.Model):
	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	technology = models.CharField('Technology', max_length=50)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# project, technology,


class SocialLink(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	name = models.CharField('Website Name', max_length=50)
	logo = models.CharField('Logo', max_length=50)
	url = models.URLField()
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, name, logo, url


class Education(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	institution = models.CharField('Institution', max_length=200)
	location = models.CharField('Location', max_length=50)
	study_area = models.CharField('Major', max_length=200)
	study_type = models.CharField('Field', max_length=200)
	start_date = models.DateField()
	end_date = models.DateField()
	gpa = models.CharField('GPA', max_length=50)
	description = models.CharField('Description', max_length=1200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, institution, location, study_area, study_type, start_date, end_date, gpa,
	# description


class Work(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	company = models.CharField('Company', max_length=50)
	location = models.CharField('Location', max_length=50)
	position = models.CharField('Position', max_length=50)
	website = models.URLField('Website', null=True)
	start_date = models.DateField()
	end_date = models.DateField()
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, company, location, position, website, start_date, end_date

	def highlights(self):
		return WorkHighlight.objects.filter(work=self.id)


class WorkHighlight(models.Model):
	work = models.ForeignKey(Work, on_delete=models.CASCADE)
	name = models.CharField("Highlight", max_length=500)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# work, name,


class Skill(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	name = models.CharField('Skill', max_length=200)
	description = models.CharField('Description', max_length=1000)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, name, description

	def keywords(self):
		return SkillKeyword.objects.filter(skill=self.id)


class SkillKeyword(models.Model):
	skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
	name = models.CharField('Keyword', max_length=200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# skill, name,


class Service(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	name = models.CharField('Service', max_length=200)
	description = models.CharField('Description', max_length=1000)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, name, description


class Testimony(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	image = models.ImageField(upload_to='image/profile/', max_length=1000, 
		default='image/profile/default_profile.jpg')
	testimony = models.CharField('Testimony', max_length=5000)
	name = models.CharField('Name', max_length=50)
	title = models.CharField('Title', max_length=150)
	link = models.URLField(null=True)


class Pricing(models.Model):
	profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
	price = models.FloatField('Price')
	name = models.CharField('Name', max_length=200)
	description = models.CharField('Description', max_length=1000)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# profile, price, name, description

	def keywords(self):
		return PricingKeyword.objects.filter(pricing=self.id)


class PricingKeyword(models.Model):
	pricing = models.ForeignKey(Pricing, on_delete=models.CASCADE)
	name = models.CharField('Keyword', max_length=200)
	status = models.CharField('Status', max_length=200, default='ACTIVE')
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# pricing, name, status


class Message(models.Model):
	first_name = models.CharField('First Name', max_length=50)
	last_name = models.CharField('Last Name', max_length=50)
	email = models.CharField('Email', max_length=50)
	message = models.CharField('Message', max_length=1500)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# first_name, last_name, email, message
