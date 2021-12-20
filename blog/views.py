from django.shortcuts import render
from .models import Article, ArticleCategory, ArticleSeries
from profile_settings.models import Profile, SocialLink

# Create your views here.
import datetime as dt


def blog(request):
	# All Articles 
	articles = Article.objects.filter(status='Publish').order_by('date_created').reverse()
	# All Category
	categories = ArticleCategory.objects.all()
	# All Series
	series = ArticleSeries.objects.all()
	# 4 Featured Posts (2 latest, 2 Most Viewed)
	viewed_articles = Article.objects.order_by('views').reverse()[0:2]
	latest_articles = articles[0:2]

	# main Featured Posts (Latest)
	featured = latest_articles[0]
	# Archive
	archives = generate_last_one_year_months()

	return render(request, 'blog/blog.html', ***REMOVED***'articles': articles, 'categories': categories, 'series': series, 
		'main_feature': featured, 'viewed_articles': viewed_articles, 'latest_articles': latest_articles, 
		'archives': archives***REMOVED***)


def article(request, slug, article_id):
	article = Article.objects.get(id=int(article_id))
	view = article.views + 1
	article.views =  view
	article.save()
	profile = Profile.objects.get(user=article.user.id)
	# All Category
	categories = ArticleCategory.objects.all()
	# All Series
	series = ArticleSeries.objects.all()
	# my series
	my_series = None
	if article.series: 
		my_series = Article.objects.filter(series=article.series.id)
	# 4 Featured Posts
	articles = Article.objects.filter(category = article.category.id).order_by('views').reverse()
	features = []
	if articles.count() >= 2:
		features = articles [0:2]
	else:
		# 4 Featured Posts (2 Most Viewed)
		features = Article.objects.order_by('views').reverse()[0:2]


	archives = generate_last_one_year_months()
	return render(request, 'blog/article.html', ***REMOVED***'article': article, 'profile': profile, 
		'categories': categories, 'series': series, 'archives': archives, 'features': features, 
		'my_series': my_series***REMOVED***)


def articles_category(request, slug, category_id):
	category = ArticleCategory.objects.get(id=int(category_id))
	articles = Article.objects.filter(category=category.id)
	return render(request, 'blog/articles.html', ***REMOVED***'articles': articles, 'category': category***REMOVED***)


def articles_series(request, slug, series_id):
	series = ArticleSeries.objects.get(id=int(series_id))
	articles = Article.objects.filter(series=series.id)
	return render(request, 'blog/articles.html', ***REMOVED***'series': series, 'articles': articles***REMOVED***)


def articles_archives(request, slug, year, month):
	# category = ArticleCategory.objects.get(id=int(archive_id))
	today = dt.datetime.now()
	return render(request, 'blog/articles.html', ***REMOVED***'today': today***REMOVED***)


def articles(request):
	return render(request, 'blog/articles.html')


def generate_last_one_year_months():
	today = dt.datetime.now()
	year = dt.timedelta(days=365)  
	month = dt.timedelta(days=27)
	one_year_ago = today - year
	loop_time = today
	months = []
	archives = []
	while loop_time > one_year_ago:
		int_month = loop_time.strftime("%m") # loop_time.month
		if int_month not in months:
			months = months + [int_month]
			int_year =  loop_time.year
			str_month = loop_time.strftime("%B")
			name = str_month + ", " + str(int_year)
			value = ***REMOVED******REMOVED*** 
			value.setdefault('year', int_year)
			value.setdefault('month', int_month)
			archive = ***REMOVED******REMOVED***

			archive.setdefault(name, value)
			archives = archives + [archive]

		loop_time = loop_time - month
	print(archives)
	return archives

