from django.shortcuts import render
from .models import Article, ArticleCategory, ArticleSeries
from profile_settings.models import Profile, SocialLink

# Create your views here.


def blog(request):
	# All Articles 
	articles = Article.objects.filter(status='Publish').order_by('date_created').reverse()
	# All Category
	category = ArticleCategory.objects.all()
	# All Series
	series = ArticleSeries.objects.all()
	# 4 Featured Posts
	featured_posts = [] 
	# main Featured Posts
	featured = None
	return render(request, 'blog/blog.html', ***REMOVED***'profile': profile, 'socials': socials***REMOVED***)


def article(request):
	return render(request, 'blog/article.html')


def articles(request):
	return render(request, 'blog/articles.html')