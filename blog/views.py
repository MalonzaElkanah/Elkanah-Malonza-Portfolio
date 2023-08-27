from django.shortcuts import render, redirect
from django.db.models import Q
from django.core.paginator import Paginator

from blog.models import Article, ArticleCategory, ArticleSeries, Comment
from profile_settings.models import Profile

# Create your views here.
import datetime as dt
from calendar import monthrange


def blog(request):
    # All Articles
    articles = (
        Article.objects.filter(status="Publish").order_by("date_created").reverse()
    )
    # All Category
    categories = ArticleCategory.objects.all()
    # All Series
    series = ArticleSeries.objects.all()
    # 4 Featured Posts (2 latest, 2 Most Viewed)
    viewed_articles = Article.objects.order_by("views").reverse()[0:2]
    latest_articles = articles[0:2]
    # main Featured Posts (Latest)
    featured = latest_articles[0]
    # Archive
    archives = generate_last_one_year_months()
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)

    return render(
        request,
        "blog/blog.html",
        {
            "articles": articles,
            "categories": categories,
            "series": series,
            "main_feature": featured,
            "viewed_articles": viewed_articles,
            "latest_articles": latest_articles,
            "archives": archives,
        },
    )


def article(request, slug, article_id):
    article = Article.objects.get(id=int(article_id))
    # Update CLicks
    view = article.views + 1
    article.views = view
    article.save()
    # Get Comments
    comments = Comment.objects.filter(article=article.id)
    # Get Author
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
    articles = (
        Article.objects.filter(category=article.category.id).order_by("views").reverse()
    )
    features = []
    if articles.count() >= 2:
        features = articles[0:2]
    else:
        # 4 Featured Posts (2 Most Viewed)
        features = Article.objects.order_by("views").reverse()[0:2]

    archives = generate_last_one_year_months()
    return render(
        request,
        "blog/article.html",
        {
            "article": article,
            "profile": profile,
            "categories": categories,
            "series": series,
            "archives": archives,
            "features": features,
            "my_series": my_series,
            "comments": comments,
        },
    )


def articles_category(request, slug, category_id):
    category = ArticleCategory.objects.get(id=int(category_id))
    articles = Article.objects.filter(category=category.id)
    # Archive
    archives = generate_last_one_year_months()
    # All Categories
    categories = ArticleCategory.objects.all()
    # All Series
    series = ArticleSeries.objects.all()
    # Name
    page_name = category.name + " Articles"
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)
    return render(
        request,
        "blog/articles.html",
        {
            "articles": articles,
            "category": category,
            "categories": categories,
            "series": series,
            "archives": archives,
            "page_name": page_name,
        },
    )


def articles_series(request, slug, series_id):
    my_series = ArticleSeries.objects.get(id=int(series_id))
    articles = Article.objects.filter(series=my_series.id)
    # Archive
    archives = generate_last_one_year_months()
    # All Categories
    categories = ArticleCategory.objects.all()
    # All Series
    series = ArticleSeries.objects.all()
    # Name
    page_name = my_series.name + " Articles"
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)
    return render(
        request,
        "blog/articles.html",
        {
            "my_series": my_series,
            "articles": articles,
            "categories": categories,
            "series": series,
            "archives": archives,
            "page_name": page_name,
        },
    )


def articles_archives(request, slug, year, month):
    month_days = monthrange(int(year), int(month))[1]
    first_month_date = dt.date(int(year), int(month), 1)
    last_month_date = dt.date(int(year), int(month), month_days)
    articles = Article.objects.filter(date_created__gte=first_month_date).filter(
        date_created__lte=last_month_date
    )
    # Archive
    archives = generate_last_one_year_months()
    # All Categories
    categories = ArticleCategory.objects.all()
    # All Series
    series = ArticleSeries.objects.all()
    # Name
    page_name = first_month_date.strftime("%B") + ", " + str(year) + " Articles"
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)
    return render(
        request,
        "blog/articles.html",
        {
            "articles": articles,
            "categories": categories,
            "series": series,
            "archives": archives,
            "page_name": page_name,
        },
    )


def articles_search(request):
    word = request.GET.get("search", None)
    articles = None
    if word is not None and word.strip() != "":
        # Search in Articles
        articles = Article.objects.filter(
            Q(title__icontains=word)
            | Q(series__name__icontains=word)
            | Q(category__name__icontains=word)
        )

    # Archive
    archives = generate_last_one_year_months()
    # All Categories
    categories = ArticleCategory.objects.all()
    # All Series
    series = ArticleSeries.objects.all()
    # Name
    page_name = "Search Results for '" + str(word) + "' Articles"
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)
    return render(
        request,
        "blog/articles.html",
        {
            "articles": articles,
            "categories": categories,
            "series": series,
            "archives": archives,
            "page_name": page_name,
        },
    )


def articles(request):
    articles = (
        Article.objects.filter(status="Publish").order_by("date_created").reverse()
    )
    # Archive
    archives = generate_last_one_year_months()
    # All Categories
    categories = ArticleCategory.objects.all()
    # All Series
    series = ArticleSeries.objects.all()
    # Name
    page_name = "All Articles"
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)
    return render(
        request,
        "blog/articles.html",
        {
            "articles": articles,
            "categories": categories,
            "series": series,
            "archives": archives,
            "page_name": page_name,
        },
    )


def comment_article(request, slug, article_id):
    if request.method == "POST":
        # Get Article
        articles = Article.objects.filter(id=int(article_id))
        if articles.count() > 0:
            # Get Comment Form Data( article, name, email, message)
            name = request.POST["name"]
            email = request.POST["email"]
            message = request.POST["message"]
            comment = Comment(
                article=articles[0], name=name, email=email, message=message
            )
            comment.save()
    return redirect("article", slug, int(article_id))


def generate_last_one_year_months():
    today = dt.datetime.now()
    year = dt.timedelta(days=365)
    month = dt.timedelta(days=27)
    one_year_ago = today - year
    loop_time = today
    months = []
    archives = []
    while loop_time > one_year_ago:
        int_month = loop_time.strftime("%m")  # loop_time.month
        if int_month not in months:
            months = months + [int_month]
            int_year = loop_time.year
            str_month = loop_time.strftime("%B")
            name = str_month + ", " + str(int_year)
            value = {}
            value.setdefault("year", int_year)
            value.setdefault("month", int_month)
            archive = {}

            archive.setdefault(name, value)
            archives = archives + [archive]

        loop_time = loop_time - month
    print(archives)
    return archives
