from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils.text import slugify

from profile_settings.models import Profile, Project, SocialLink, Education, Work, Skill, Service
from profile_settings.models import Testimony, Pricing, Message
from profile_settings.models import ProjectKeyword, WorkHighlight, SkillKeyword, PricingKeyword
from profile_settings.forms import ProfileForm, ProjectForm, WorkForm, EducationForm
from blog.models import ArticleSeries, ArticleCategory, Article, Comment
from blog.forms import ArticleForm


def check_profile(user):
	profile = Profile.objects.filter(user=user.id)
	return profile.count()>=1


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def home(request):
	return render(request, 'admin/home.html')

@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def messages(request):
	return render(request, 'admin/messages.html')

@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def profile(request):
	profile = Profile.objects.get(user=request.user.id)
	socials = SocialLink.objects.filter(profile=profile.id)
	return render(request, 'admin/profile-view.html', ***REMOVED***'profile': profile, 'socials': socials***REMOVED***)


@login_required(login_url='/login/')
def edit_profile(request):
	# Get Profile data if exists
	profile = None
	form = None
	profiles = Profile.objects.filter(user=request.user.id)
	socials = None
	if profiles.count() > 0:
		profile = profiles[0]
		form = ProfileForm(instance=profile)
		socials = socials = SocialLink.objects.filter(profile=profile.id)
	else:
		data = ***REMOVED***'user': request.user.id, 'first_name': request.user.first_name, 
		'second_name': request.user.last_name, 'email': request.user.email***REMOVED***
		form = ProfileForm(data)
	# Check if request is from a form 
	if request.method == 'POST':
		# Add profile if it does not exist 
		# Update profile if If EXIST
		if profile == None:
			form = ProfileForm(request.POST, request.FILES)
			if form.is_valid():
				form.save()
			else:
				return HttpResponse(form.errors)
		else:
			form = ProfileForm(request.POST, request.FILES, instance=profile)
			if form.is_valid():
				form.save()
			else:
				return HttpResponse(form.errors)

		user = request.user
		user.last_name = request.POST['second_name']
		user.first_name = request.POST['first_name']
		user.email = request.POST['email_1']
		user.save()

		profile = Profile.objects.get(user=request.user.id)
		# Update Social links
		for social in socials:
			name = request.POST['name-'+str(social.id)]
			logo = request.POST['logo-'+str(social.id)]
			url = request.POST['url-'+str(social.id)]
			social.name =  name
			social.logo = logo 
			social.url = url
			social.save() 

		# Add New Social Links
		# Get the number of new social links
		form_num = int(request.POST['form_num'])
		form_num = form_num + 1
		# Loop through all the new social items
		for x in range(1,form_num):
			try:
				name = request.POST['name_'+str(x)]
				logo = request.POST['logo_'+str(x)]
				url = request.POST['url_'+str(x)]
				social = SocialLink(profile=profile, name=name, logo=logo, url=url)
				social.save()
			except Exception:
				pass
		return redirect('admin-profile')
	else:
		return render(request, 'admin/profile-edit.html', ***REMOVED***'profile': profile, 'form': form, 
			'socials': socials***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def projects(request):
	profile = Profile.objects.get(user=request.user.id)
	projects = Project.objects.filter(profile=profile.id)
	return render(request, 'admin/projects.html', ***REMOVED***'profile': profile, 'projects': projects***REMOVED***) 


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def project(request, slug, project_id):
	project = Project.objects.get(id=int(project_id))
	return render(request, 'admin/project.html', ***REMOVED***'project': project***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def project_edit(request, slug, project_id):
	# Get profile and project data
	profile = Profile.objects.get(user=request.user.id)
	project = Project.objects.get(id=int(project_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the project data if request from a form
		form = ProjectForm(request.POST, instance=project)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)

		# Update Project Keywords
		keywords = request.POST['keywords']
		keywords_dic = keywords.split(',')
		# Get old keywords and Delete them
		project_keywords = ProjectKeyword.objects.filter(project=project.id)
		project_keywords.delete()
		# Add new keywords
		for keyword in keywords_dic:
			new_keyword = ProjectKeyword(project=project, technology=keyword)
			new_keyword.save()

		return redirect('admin-project', slugify(project.name), project.id)
	else:
		state = 'EDIT_STATE'
		form = ProjectForm(instance=project)
		return render(request, 'admin/project-edit.html', ***REMOVED***'profile': profile, 'state': state, 
			'project': project, 'form': form***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def project_add(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		project = None
		form = ProjectForm(request.POST, request.FILES)
		if form.is_valid():
			project = form.save()
		else:
			return HttpResponse(form.errors)

		# Add new Project Keywords
		keywords = request.POST['keywords']
		keywords_dic = keywords.split(',')
		for keyword in keywords_dic:
			new_keyword = ProjectKeyword(project=project, technology=keyword)
			new_keyword.save()
		return redirect('admin-project', slugify(project.name), project.id)
	else:
		state = 'ADD_STATE'
		form = ProjectForm()
		return render(request, 'admin/project-edit.html', ***REMOVED***'profile': profile, 'state': state, 'form': form***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def work(request):
	profile = Profile.objects.get(user=request.user.id)
	work = Work.objects.filter(profile=profile.id)
	return render(request, 'admin/work.html', ***REMOVED***'work_history': work, 'profile': profile***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def edit_work(request, slug, work_id):
	profile = Profile.objects.get(user=request.user.id)
	work = Work.objects.get(id=int(work_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the work data if request from a form
		form = WorkForm(request.POST, instance=work)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)

		# Update Work Highlights
		highlights = WorkHighlight.objects.filter(work=work.id)
		for highlight in highlights:
			name = request.POST['name-'+str(highlight.id)]
			highlight.name =  name
			highlight.save() 

		# Add New Work Highlights
		# Get the number of new Work Highlights
		form_num = int(request.POST['form_num'])
		form_num = form_num + 1
		# Loop through all the new social items
		for x in range(1,form_num):
			try:
				name = request.POST['name_'+str(x)]
				highlight = WorkHighlight(work=work, name=name)
				highlight.save()
			except Exception:
				pass
		return redirect('admin-work')
	else:
		state = 'EDIT_STATE'
		form = WorkForm(instance=work)
		return render(request, 'admin/work-edit.html', ***REMOVED***'profile': profile, 'state': state, 
			'work': work, 'form': form***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def add_work(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		work = None
		form = WorkForm(request.POST)
		if form.is_valid():
			work = form.save()
		else:
			return HttpResponse(form.errors)

		# Add new Work Highlights
		# Get the number of new Work Highlights
		form_num = int(request.POST['form_num'])
		form_num = form_num + 1
		# Loop through all the new social items
		for x in range(1,form_num):
			try:
				name = request.POST['name_'+str(x)]
				highlight = WorkHighlight(work=work, name=name)
				highlight.save()
			except Exception:
				pass
		
		return redirect('admin-work')
	else:
		state = 'ADD_STATE'
		form = WorkForm()
		return render(request, 'admin/work-edit.html', ***REMOVED***'profile': profile, 'form': form, 
			'state': state***REMOVED***)



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def education(request):
	profile = Profile.objects.get(user=request.user.id)
	edu = Education.objects.filter(profile=profile.id)
	return render(request, 'admin/education.html', ***REMOVED***'profile': profile, 'edu_history': edu***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def edit_education(request, slug, edu_id):
	profile = Profile.objects.get(user=request.user.id)
	edu = Education.objects.get(id=int(edu_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the Education data if request from a form
		form = EducationForm(request.POST, instance=edu)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)

		return redirect('admin-education')
	else:
		state = 'EDIT_STATE'
		form = EducationForm(instance=edu)
		return render(request, 'admin/education-edit.html', ***REMOVED***'profile': profile, 'form': form, 
			'state': state, 'edu': edu***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def add_education(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		work = None
		form = EducationForm(request.POST)
		if form.is_valid():
			edu = form.save()
		else:
			return HttpResponse(form.errors)
		return redirect('admin-education')
	else:
		state = 'ADD_STATE'
		return render(request, 'admin/education-edit.html', ***REMOVED***'profile': profile, 'state': state***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def skills(request):
	profile = Profile.objects.get(user=request.user.id)
	skills = Skill.objects.filter(profile=profile.id)
	return render(request, 'admin/skills.html', ***REMOVED***'profile': profile, 'skills': skills***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def skills_edit(request, slug, skill_id):
	# Get profile and project data
	profile = Profile.objects.get(user=request.user.id)
	skill = Skill.objects.get(id=int(skill_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the project data if request from a form
		name = request.POST['name']
		description = request.POST['description']
		skill.name = name
		skill.description = description
		skill.save()

		# Update Project Keywords
		keywords = request.POST['keywords']
		keywords_dic = keywords.split(',')
		# Get old keywords and Delete them
		skill_keywords = SkillKeyword.objects.filter(skill=skill.id)
		skill_keywords.delete()
		# Add new keywords
		for keyword in keywords_dic:
			new_keyword = SkillKeyword(skill=skill, name=keyword)
			new_keyword.save()
		return redirect('admin-skills')
	else:
		state = 'EDIT_STATE'
		return render(request, 'admin/skills-edit.html', ***REMOVED***'state': state, 'skill': skill***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def skills_add(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		# Add New Skill
		name = request.POST['name']
		description = request.POST['description']
		skill = Skill(profile=profile, name=name, description=description)
		skill.save() 
		# Add new Keywords
		keywords = request.POST['keywords']
		keywords_dic = keywords.split(',')
		for keyword in keywords_dic:
			new_keyword = SkillKeyword(skill=skill, name=keyword)
			new_keyword.save()
		return redirect('admin-skills')
	else:
		state = 'ADD_STATE'
		return render(request, 'admin/skills-edit.html')


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def services(request):
	# Get profile and service data
	profile = Profile.objects.get(user=request.user.id)
	services = Service.objects.filter(profile=profile.id)
	return render(request, 'admin/services.html', ***REMOVED***'profile': profile, 'services': services***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def services_edit(request, slug, service_id):
	# Get profile and service data
	profile = Profile.objects.get(user=request.user.id)
	service = Service.objects.get(id=int(service_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the Service data if request from a form
		name = request.POST['name']
		logo = request.POST['logo']
		description = request.POST['description']
		service.name = name
		service.logo = logo
		service.description = description
		service.save()
		return redirect('admin-services')
	else:
		state = 'EDIT_STATE'
		return render(request, 'admin/services-edit.html', ***REMOVED***'service': service, 'profile': profile,
			'state': state***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def services_add(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		# Add New Services
		name = request.POST['name']
		logo = request.POST['logo']
		description = request.POST['description']
		service = Service(profile=profile, name=name, logo=logo, description=description)
		service.save() 
		return redirect('admin-services')
	else:
		state = 'ADD_STATE'
		return render(request, 'admin/services-edit.html', ***REMOVED***'profile': profile, 'state': state***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def prices(request):
	# Get profile and price data
	profile = Profile.objects.get(user=request.user.id)
	pricing = Pricing.objects.filter(profile=profile.id)
	return render(request, 'admin/prices.html', ***REMOVED***'prices': pricing, 'profile': profile***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def price_edit(request, slug, price_id):
	# Get profile and price data
	profile = Profile.objects.get(user=request.user.id)
	pricing = Pricing.objects.get(id=int(price_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the Service data if request from a form
		name = request.POST['name']
		price = request.POST['price']
		description = request.POST['description']
		pricing.name = name
		pricing.price = price 
		pricing.description = description
		pricing.save()
		# Update Pricing Keyword
		keywords = PricingKeyword.objects.filter(pricing=pricing.id)
		for keyword in keywords:
			price = request.POST['price-'+int(keyword.id)]
			status = request.POST['status-'+int(keyword.id)]
			keyword.price = price
			keyword.status = status
			keyword.save()

		#Add New Keywords
		# Get the number of new Work Highlights
		form_num = int(request.POST['form_num'])
		form_num = form_num + 1
		# Loop through all the new social items
		for x in range(1,form_num):
			#try:
			name = request.POST['name_'+str(x)]
			status = request.POST['status_'+str(x)]
			keyword = PricingKeyword(pricing=pricing, name=name, status=status)
			keyword.save()
			#except Exception:
			#	pass
		
		return redirect('admin-prices')
	else:
		state = 'EDIT_STATE'
		return render(request, 'admin/price-edit.html', ***REMOVED***'price': pricing, 'profile': profile,
			'state': state***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def price_add(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		# Add New Pricing
		name = request.POST['name']
		price = float(request.POST['price'])
		description = request.POST['description']
		price = Pricing(profile=profile, name=name, price=price, description=description)
		price.save() 

		# Add New Keywords
		# Get the number of new Keywords
		form_num = int(request.POST['form_num'])
		form_num = form_num + 1
		# Loop through all the new Keywords items
		for x in range(1, form_num):
			try:
				name = request.POST['name_'+str(x)]
				status = request.POST['status_'+str(x)]
				keyword = PricingKeyword(pricing=price, name=name, status=status)
				keyword.save()
			except Exception:
				pass

		return redirect('admin-prices')
	else:
		state = 'ADD_STATE'
		return render(request, 'admin/price-edit.html', ***REMOVED***'profile': profile, 'state': state***REMOVED***)



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def blog(request):
	profile = Profile.objects.get(user=request.user.id)
	articles = Article.objects.all()
	categories = ArticleCategory.objects.all()
	series = ArticleSeries.objects.all()
	return render(request, 'admin/blog-view.html', ***REMOVED***'profile': profile, 'articles': articles, 
		'series': series, 'categories': categories***REMOVED***) 


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def edit_blog(request, slug, article_id):
	profile = Profile.objects.get(user=request.user.id)
	article = Article.objects.get(id=int(article_id))
	# Check if request is from a form
	if request.method == 'POST':
		# Update the Education data if request from a form
		form = ArticleForm(request.POST, instance=article)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)
		return redirect('admin-blog')
	else:
		state = 'EDIT_STATE'
		form = ArticleForm(instance=article)
		categories = ArticleCategory.objects.all()
		series = ArticleSeries.objects.all()
		return render(request, 'admin/blog-edit.html', ***REMOVED***'state': state, 'form': form, 'article': article,
			'profile': profile, 'categories': categories, 'series': series***REMOVED***) 



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def add_blog(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		article = None
		form = ArticleForm(request.POST, request.FILES)
		if form.is_valid():
			article = form.save()
		else:
			return HttpResponse(form.errors)
		return redirect('admin-blog')
	else:
		state = 'ADD_STATE'
		form = ArticleForm()
		categories = ArticleCategory.objects.all()
		series = ArticleSeries.objects.all()
		return render(request, 'admin/blog-edit.html', ***REMOVED***'state': state, 'profile': profile, 
			'form': form, 'categories': categories, 'series': series***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def add_category(request):
	if request.is_ajax():
		form_num = int(request.POST['form_num'])
		form_num = form_num + 1
		for x in range(1, form_num):
			#try:
			name = request.POST['category-name_'+str(x)]
			category = ArticleCategory(name=name)
			category.save()
			#except Exception:
			#	name = ''
		return JsonResponse(***REMOVED***"success": "Category Created"***REMOVED***, status=200)
	else:
		return redirect('admin-blog') 


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def add_series(request):
	if request.is_ajax():
		form_num = int(request.POST['form_num-series'])
		form_num = form_num + 1
		for x in range(1, form_num):
			#try:
			name = request.POST['series-name_'+str(x)]
			series = ArticleSeries(name=name)
			series.save()
			#except Exception:
			#	name = ''
		return JsonResponse(***REMOVED***"success": "Series Created"***REMOVED***, status=200)
	else:
		return redirect('admin-blog') 



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def settings(request):
	return render(request, 'admin/settings.html')


#@login_required(login_url='/auth-login/')
def layout_settings(request):
	pass 

# @login_required(login_url='/auth-login/')
def sidebar_color_settings(request):
	pass


@login_required(login_url='/auth-login/')
def color_theme_settings(request):
	pass


# @login_required(login_url='/auth-login/')
def sidebar_toggle(request):
	pass


# @login_required(login_url='/auth-login/')
def sticky_header(request):
	pass


# @login_required(login_url='/auth-login')
def restore_default(request):
	pass


