from django import forms
from django.forms import ModelForm
from .models import Profile, Project


class ProfileForm(ModelForm):
	class Meta:
		model = Profile
		fields = ( 'user', 'first_name', 'second_name', 'image', 'phone_number_1', 'phone_number_2', 
			'email_1', 'email_2', 'description', 'address')


class ProjectForm(ModelForm):
	class Meta:
		model = Project
		fields = ('profile', 'name', 'description', 'url', 'date')

