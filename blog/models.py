from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class ArticleSeries(models.Model):
	name = models.CharField('Keyword', max_length=200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# name,


class ArticleCategory(models.Model):
	name = models.CharField('Keyword', max_length=200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# name,


class Article(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	image = models.ImageField(upload_to='image/blog/', max_length=1000, 
		default='image/blog/blog_default.jpg')
	title = models.CharField('Title', max_length=50)
	content = models.TextField()
	tags = models.CharField('Tags', max_length=50)
	status = models.CharField('Status', max_length=50, default='PRIVATE')
	views = models.IntegerField('Views')
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	category = models.ForeignKey(ArticleCategory, on_delete=models.CASCADE)
	series = models.ForeignKey(ArticleSeries, on_delete=models.CASCADE, null=True)
	# user, image, title, content, tags, status, views, date_created, category, series 

