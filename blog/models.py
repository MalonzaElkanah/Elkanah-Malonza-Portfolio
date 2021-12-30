from django.db import models
from django.contrib.auth.models import User
from django.utils.html import strip_tags

# Create your models here. 

class ArticleSeries(models.Model):
	name = models.CharField('Keyword', max_length=200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# name,

	def articles(self):
		return Article.objects.filter(series = self.id)

	def article_count(self):
		return Article.objects.filter(series=self.id).count()


class ArticleCategory(models.Model):
	name = models.CharField('Keyword', max_length=200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# name,

	def articles(self):
		return Article.objects.filter(category = self.id)

	def article_count(self):
		return Article.objects.filter(category=self.id).count()



class Article(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	image = models.ImageField(upload_to='image/blog/', max_length=1000, 
		default='image/blog/blog_default.jpg', storage=gd_storage)
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

	def comments(self):
		return Comment.objects.filter(article=self.id)


class Comment(models.Model):
	article = models.ForeignKey(Article, on_delete=models.CASCADE)
	name = models.CharField('Keyword', max_length=200)
	email = models.CharField('Email', max_length=200)
	message = models.CharField('Keyword', max_length=1200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)
	# article, name, email, message

	def replies(self):
		return CommentReply.objects.filter(comment=self.id)


class CommentReply(models.Model):
	comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
	name = models.CharField('Keyword', max_length=200)
	email = models.CharField('Email', max_length=200)
	message = models.CharField('Keyword', max_length=1200)
	date_created = models.DateTimeField('Date Created', auto_now_add=True)

