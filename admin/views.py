from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test

from profile_settings.models import Profile, Project, SocialLink, Education, Work, Skill, Service
from profile_settings.models import Testimony, Pricing, Message
from profile_settings.models import ProjectKeyword, WorkHighlight, SkillKeyword, PricingKeyword
from profile_settings.forms import ProfileForm, ProjectForm


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
	profile = Profile.objects.get(user=request.user.id)
	project = Project.objects.get(id=int(project_id))
	if request.method == 'POST':
		form = ProjectForm(request.POST, instance=project)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)

		return redirect('admin-project')
	else:
		state = 'EDIT_STATE'
		return render(request, 'admin/project-edit.html', ***REMOVED***'profile': profile, 'state': state, 
			'project': project***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
def project_add(request):
	profile = Profile.objects.get(user=request.user.id)
	if request.method == 'POST':
		form = ProjectForm(request.POST)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)

		return redirect('admin-project')
	else:
		state = 'ADD_STATE'
		return render(request, 'admin/project-edit.html', ***REMOVED***'profile': profile, 'state': state***REMOVED***)


def work(request):
	return render(request, 'admin/work.html')

def edit_work(request):
	return render(request, 'admin/work-edit.html')

def education(request):
	return render(request, 'admin/education.html')

def edit_education(request):
	return render(request, 'admin/education-edit.html')

def skills(request):
	return render(request, 'admin/skills.html')

def skills_edit(request):
	return render(request, 'admin/skills-edit.html')

def services(request):
	return render(request, 'admin/services.html')

def services_edit(request):
	return render(request, 'admin/services-edit.html')

def blog(request):
	return render(request, 'admin/blog-view.html') 

def edit_blog(request):
	return render(request, 'admin/blog-edit.html') 

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


