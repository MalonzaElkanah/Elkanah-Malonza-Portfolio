from django.shortcuts import render

# Create your views here.


def blog(request):
	return render(request, 'blog/blog.html')


def article(request):
	return render(request, 'blog/article.html')


def articles(request):
	return render(request, 'blog/articles.html')