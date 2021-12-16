from django import forms
from django.forms import ModelForm
from .models import Article

class ArticleForm(ModelForm):
	class Meta:
		model = Article
		fields = ( 'user', 'image', 'title', 'content', 'tags', 'status', 'views', 'category', 'series')


