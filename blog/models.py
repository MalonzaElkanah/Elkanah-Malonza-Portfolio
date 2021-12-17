from django.db import models
from django.contrib.auth.models import User
from django.utils.html import strip_tags

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
	views = models.IntegerField('Views', default=0, null=True, blank=True)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	category = models.ForeignKey(ArticleCategory, on_delete=models.CASCADE)
	series = models.ForeignKey(ArticleSeries, on_delete=models.CASCADE, null=True, blank=True)
	# user, image, title, content, tags, status, views, date_created, category, series 

	def content_text(self):
		return strip_tags(self.content)


class Comment(models.Model):
	article = models.ForeignKey(Article, on_delete=models.CASCADE)
	name = models.CharField('Keyword', max_length=200)
	email = models.CharField('Email', max_length=200)
	message = models.CharField('Keyword', max_length=1200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)


class CommentReply(models.Model):
	comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
	name = models.CharField('Keyword', max_length=200)
	email = models.CharField('Email', max_length=200)
	message = models.CharField('Keyword', max_length=1200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)

