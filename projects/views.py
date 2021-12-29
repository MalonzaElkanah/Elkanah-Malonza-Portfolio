from django.shortcuts import render, redirect
from profile_settings.models import Project, ProjectKeyword
# Create your views here.


def projects(request):
	projects = Project.objects.all()
	keywords = unique_project_keywords()
	page_name = 'All Projects'
	return render(request, 'projects/projects.html', ***REMOVED***'projects': projects, 'keywords': keywords, 
		'page_name': page_name***REMOVED***)


def project(request, slug, project_id):
	project = Project.objects.get(id=project_id)
	keywords = unique_project_keywords()
	return render(request, 'projects/project.html', ***REMOVED***'project': project, 'keywords': keywords***REMOVED***)


def project_technology(request, slug):
	keyword = slug
	slug_keywords = ProjectKeyword.objects.filter(technology__icontains=slug)
	keywords = unique_project_keywords()
	page_name = str(slug)+' Projects'
	projects = []
	for keyword in slug_keywords:
		if keyword.project not in projects:
			projects += [keyword.project] 
	return render(request, 'projects/projects.html', ***REMOVED***'projects': projects, 'keywords': keywords, 
		'page_name': page_name***REMOVED***)


def project_search(request):
	search = request.GET.get('search', None)
	projects = None
	if search is not None and search.strip() != '':
		projects = []
		# search in projects
		search_projects = Project.objects.filter(name__icontains=search)
		for  project in search_projects:
			if project not in projects:
				projects += [project] 

		# Search in ProjectKeyword
		search_keywords = ProjectKeyword.objects.filter(technology__icontains=search)
		for keyword in search_keywords:
			if keyword.project not in projects:
				projects += [keyword.project] 

	keywords = unique_project_keywords()
	page_name = 'Search Results for "' + str(search) + '" Projects'
	return render(request, 'projects/projects.html', ***REMOVED***'projects': projects, 'keywords': keywords, 
		'page_name': page_name***REMOVED***)


def unique_project_keywords():
	keywords = ProjectKeyword.objects.all()
	unique_keywords = []
	for keyword in keywords:
		if keyword.technology.strip() not in unique_keywords:
			unique_keywords += [keyword.technology.strip()]

	return unique_keywords 
