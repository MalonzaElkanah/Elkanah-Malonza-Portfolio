from django import forms
from django.forms import ModelForm
from .models import Profile, Project, Work, Education


class ProfileForm(ModelForm):
	class Meta:
		model = Profile
		fields = ( 'user', 'first_name', 'second_name', 'image', 'phone_number_1', 'phone_number_2', 
			'email_1', 'email_2', 'description', 'address')


class ProjectForm(ModelForm):
	class Meta:
		model = Project
		fields = ('profile', 'image', 'name', 'description', 'url', 'date')


class WorkForm(ModelForm):
	class Meta:
		model = Work
		fields = ('profile', 'company', 'location', 'position', 'website', 'start_date', 'end_date')


class EducationForm(ModelForm):
	class Meta:
		model = Education
		fields = ('profile', 'institution', 'location', 'study_area', 'study_type', 'start_date', 
			'end_date', 'gpa', 'description')

		