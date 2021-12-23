from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils.text import slugify

from profile_settings.models import Profile, Project, SocialLink, Education, Work, Skill, Service
from profile_settings.models import Testimony, Pricing, Message, AppSettings, ProjectImage
from profile_settings.models import ProjectKeyword, WorkHighlight, SkillKeyword, PricingKeyword
from profile_settings.models import TechnicalSkillHighlight, ProfessionalSkillHighlight
from profile_settings.forms import ProfileForm, ProjectForm, WorkForm, EducationForm, AppSettingsForm
from profile_settings.forms import ProjectImageForm
from blog.models import ArticleSeries, ArticleCategory, Article, Comment
from blog.forms import ArticleForm


def check_profile(user):
	profile = Profile.objects.filter(user=user.id)
	return profile.count()>=1

def check_settings(user):
	app = AppSettings.objects.filter(user=user.id)
	return app.count()>=1


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def home(request):
	app = AppSettings.objects.get(user=request.user.id)
	profile = Profile.objects.get(user=request.user.id)
	return render(request, 'admin/home.html', ***REMOVED***'profile': profile, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def messages(request):
	app = AppSettings.objects.get(user=request.user.id)
	profile = Profile.objects.get(user=request.user.id)
	return render(request, 'admin/messages.html', ***REMOVED***'profile': profile, 'app': app***REMOVED***)

@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def profile(request):
	profile = Profile.objects.get(user=request.user.id)
	socials = SocialLink.objects.filter(profile=profile.id)
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/profile-view.html', ***REMOVED***'profile': profile, 'socials': socials, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def edit_profile(request):
	# Get Profile data if exists
	profile = None
	form = None
	profiles = Profile.objects.filter(user=request.user.id)
	app = AppSettings.objects.get(user=request.user.id)
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
		return render(request, 'admin/profile-edit.html', ***REMOVED***'profile': profile, 'form': form, 'app': app, 
			'socials': socials***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def projects(request):
	profile = Profile.objects.get(user=request.user.id)
	projects = Project.objects.filter(profile=profile.id)
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/projects.html', ***REMOVED***'profile': profile, 'projects': projects, 'app': app***REMOVED***) 


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def project(request, slug, project_id):
	project = Project.objects.get(id=int(project_id))
	app = AppSettings.objects.get(user=request.user.id)
	profile = Profile.objects.get(user=request.user.id)
	return render(request, 'admin/project.html', ***REMOVED***'project': project, 'app': app, 'profile': profile***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def project_edit(request, slug, project_id):
	# Get profile and project data
	profile = Profile.objects.get(user=request.user.id)
	project = Project.objects.get(id=int(project_id))
	# Check if request is from a form
	if request.method == 'POST':
		print("check point1111--")
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

		# Add New Project Images
		new_images = request.FILES.getlist('new_images')
		for image in new_images:
			project_image = ProjectImage(project=project, picture=image)
			project_image.save()
		return redirect('admin-project', slugify(project.name), project.id)
	else:
		state = 'EDIT_STATE'
		form = ProjectForm(instance=project)
		form_set = []

		for img in project.images():
			image_form = ProjectImageForm(instance=img)
			[]
			form_set += [[img, image_form]]
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/project-edit.html', ***REMOVED***'profile': profile, 'state': state, 
			'project': project, 'form_set': form_set, 'form': form, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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

		# Update Project Images
		images = request.FILES.getlist('images')
		for image in images:
			project_image = ProjectImage(project=project, picture=image)
			project_image.save()
			
		return redirect('admin-project', slugify(project.name), project.id)
	else:
		state = 'ADD_STATE'
		form = ProjectForm()
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/project-edit.html', ***REMOVED***'profile': profile, 'state': state, 'form': form, 
			'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def project_image_update(request, slug, image_id):
	image = ProjectImage.objects.get(id=int(image_id))
	if request.method == 'POST':
		# Update Project Images
		form = ProjectImageForm(request.POST, request.FILES, instance=image)
		if form.has_changed():
			if form.is_valid():
				form.save()
			else:
				print(image_form.errors)
		else:
			print("=-----Not Changed")

		return redirect('admin-project', slug, image.project.id)
	else: 
		print("check point-3")
		return redirect('admin-project', slug, image.project.id)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def project_image_delete(request, slug, image_id):
	image = ProjectImage.objects.filter(id=int(image_id))
	if image.count() > 0:
		project = image[0].project
		if image[0].project.profile.user.id == request.user.id:
			image.delete()
			return redirect('admin-project', slug, project.id)
		else:
			return HttpResponse("Access Denied")
	else:
		return HttpResponse("No Data to Remove")



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def work(request):
	profile = Profile.objects.get(user=request.user.id)
	work = Work.objects.filter(profile=profile.id)
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/work.html', ***REMOVED***'work_history': work, 'profile': profile, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/work-edit.html', ***REMOVED***'profile': profile, 'state': state, 
			'work': work, 'form': form, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/work-edit.html', ***REMOVED***'profile': profile, 'form': form, 
			'state': state, 'app': app***REMOVED***)



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def education(request):
	profile = Profile.objects.get(user=request.user.id)
	edu = Education.objects.filter(profile=profile.id)
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/education.html', ***REMOVED***'profile': profile, 'edu_history': edu, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/education-edit.html', ***REMOVED***'profile': profile, 'form': form, 
			'state': state, 'edu': edu, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/education-edit.html', ***REMOVED***'profile': profile, 'state': state, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def skills(request):
	profile = Profile.objects.get(user=request.user.id)
	skills = Skill.objects.filter(profile=profile.id)
	tech_skills = TechnicalSkillHighlight.objects.all()
	prof_skills = ProfessionalSkillHighlight.objects.all()
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/skills.html', ***REMOVED***'profile': profile, 'skills': skills, 'app': app, 
		'tech_skills': tech_skills, 'prof_skills': prof_skills***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/skills-edit.html', ***REMOVED***'state': state, 'skill': skill, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def skills_technical_add(request):
	if request.method == 'POST':
		# Get form data
		percentage = int(request.POST['percentage'])
		keyword_id = int(request.POST['skill_keyword'])
		keyword = SkillKeyword.objects.get(id=keyword_id)
		tech_skill = TechnicalSkillHighlight(skill_keyword=keyword, percentage=percentage)
		tech_skill.save()
		return redirect('admin-skills') 
	else:
		return redirect('admin-skills')


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def skills_technical_edit(request):
	if request.method == 'POST':
		# Get form data
		percentage = int(request.POST['percentage'])
		keyword_id = int(request.POST['skill_keyword'])
		tech_skill_id = int(request.POST['tech_skill_id'])
		# Update TechnicalSkillHighlight
		keyword = SkillKeyword.objects.get(id=keyword_id)
		tech_skill = TechnicalSkillHighlight.objects.get(id=tech_skill_id)
		tech_skill.skill_keyword = keyword 
		tech_skill.percentage = percentage
		tech_skill.save()
		return redirect('admin-skills') 
	else:
		return redirect('admin-skills')


def skills_delete_edit(tech_id):
	tech_skill = TechnicalSkillHighlight.objects.get(id=tech_id)
	if tech_skill.skill_keyword.skill.profile.user.id == request.user.id:
		tech_skill.delete()
		return redirect('admin-skills')
	else:
		return HttpResponse("Request Denied.") 


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/skills-edit.html', ***REMOVED***'app': app, 'state': state, 'profile': profile***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def skills_professional_add(request):
	if request.method == 'POST':
		# Get form data
		percentage = int(request.POST['percentage'])
		name = request.POST['name']
		profile = Profile.objects.get(user=request.user.id)
		skill = ProfessionalSkillHighlight(profile=profile, name=name, percentage=percentage)
		skill.save()
		return redirect('admin-skills') 
	else:
		return redirect('admin-skills')


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def skills_professional_edit(request):
	if request.method == 'POST':
		# Get form data
		percentage = int(request.POST['percentage'])
		name = request.POST['name']
		skill_id = int(request.POST['prof_skill_id'])
		# Update TechnicalSkillHighlight
		skill = ProfessionalSkillHighlight.objects.get(id=skill_id)
		skill.name = name 
		skill.percentage = percentage
		skill.save()
		return redirect('admin-skills') 
	else:
		return redirect('admin-skills')




@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def services(request):
	# Get profile and service data
	profile = Profile.objects.get(user=request.user.id)
	services = Service.objects.filter(profile=profile.id)
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/services.html', ***REMOVED***'profile': profile, 'services': services, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/services-edit.html', ***REMOVED***'service': service, 'profile': profile,
			'state': state, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/services-edit.html', ***REMOVED***'profile': profile, 'state': state, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def prices(request):
	# Get profile and price data
	profile = Profile.objects.get(user=request.user.id)
	pricing = Pricing.objects.filter(profile=profile.id)
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/prices.html', ***REMOVED***'prices': pricing, 'profile': profile, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/price-edit.html', ***REMOVED***'price': pricing, 'profile': profile,
			'state': state, 'app': app***REMOVED***)


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/price-edit.html', ***REMOVED***'profile': profile, 'state': state, 'app': app***REMOVED***)



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
def blog(request):
	profile = Profile.objects.get(user=request.user.id)
	articles = Article.objects.all()
	categories = ArticleCategory.objects.all()
	series = ArticleSeries.objects.all()
	app = AppSettings.objects.get(user=request.user.id)
	return render(request, 'admin/blog-view.html', ***REMOVED***'profile': profile, 'articles': articles, 
		'series': series, 'categories': categories, 'app': app***REMOVED***) 


@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/blog-edit.html', ***REMOVED***'state': state, 'form': form, 'article': article,
			'profile': profile, 'categories': categories, 'series': series, 'app': app***REMOVED***) 



@login_required(login_url='/login/')
@user_passes_test(check_profile, login_url='/admin/edit/profile/')
@user_passes_test(check_settings, login_url='/admin/settings/')
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
		app = AppSettings.objects.get(user=request.user.id)
		return render(request, 'admin/blog-edit.html', ***REMOVED***'state': state, 'profile': profile, 
			'form': form, 'categories': categories, 'series': series, 'app': app***REMOVED***)


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
	app_settings = AppSettings.objects.filter(user=request.user.id)
	if app_settings.count() == 0: 
		init_app_settings(request.user)
	app = AppSettings.objects.get(user=request.user.id)
	if request.method == 'POST':
		form = AppSettingsForm(request.POST, request.FILES, instance=app)
		if form.is_valid():
			form.save()
		else:
			return HttpResponse(form.errors)
		return redirect('admin-settings') 
	else:
		profile = Profile.objects.get(user=request.user.id)
		form = AppSettingsForm(instance=app)
		return render(request, 'admin/settings.html', ***REMOVED***'app': app, 'form': form, 'profile': profile***REMOVED***)


@login_required(login_url='/login/')
def layout_settings(request):
	try:
		app_settings = AppSettings.objects.get(user=request.user.id)
	except Exception:
		app_settings = init_app_settings(request.user)
	layout = str(request.GET['layout'])
	settings = AppSettings.objects.filter(user=request.user.id)
	if layout == "1":
		# light light-sidebar theme-white
		settings.update(layout=layout, sidebar_color="1", color_theme="white")
	elif layout == "2":
		# dark dark-sidebar theme-black
		settings.update(layout=layout, sidebar_color="2", color_theme="black")
	return JsonResponse(***REMOVED***"success": "Settings Updated"***REMOVED***, status=200)


@login_required(login_url='/login/')
def sidebar_color_settings(request):
	try:
		app_settings = AppSettings.objects.get(user=request.user.id)
	except Exception:
		app_settings = init_app_settings(request.user)
	sidebar = str(request.GET['sidebar'])
	settings = AppSettings.objects.filter(user=request.user.id)
	settings.update(sidebar_color=sidebar)
	return JsonResponse(***REMOVED***"success": "Settings Updated"***REMOVED***, status=200)


@login_required(login_url='/login/')
def color_theme_settings(request):
	try:
		app_settings = AppSettings.objects.get(user=request.user.id)
	except Exception:
		app_settings = init_app_settings(request.user)
	theme = str(request.GET['theme'])
	settings = AppSettings.objects.filter(user=request.user.id)
	settings.update(color_theme=theme)
	return JsonResponse(***REMOVED***"success": "Settings Updated"***REMOVED***, status=200)



@login_required(login_url='/login/')
def sidebar_toggle(request):
	try:
		app_settings = AppSettings.objects.get(user=request.user.id)
	except Exception:
		app_settings = init_app_settings(request.user)
	sidebar = str(request.GET['sidebar'])
	settings = AppSettings.objects.filter(user=request.user.id)
	settings.update(mini_sidebar=sidebar)
	return JsonResponse(***REMOVED***"success": "Settings Updated"***REMOVED***, status=200)




@login_required(login_url='/login/')
def sticky_header(request):
	try:
		app_settings = AppSettings.objects.get(user=request.user.id)
	except Exception:
		app_settings = init_app_settings(request.user)
	header = str(request.GET['header'])
	settings = AppSettings.objects.filter(user=request.user.id)
	settings.update(sticky_header=header)
	return JsonResponse(***REMOVED***"success": "Settings Updated"***REMOVED***, status=200)


@login_required(login_url='/login/')
def restore_default(request):
	try:
		app_settings = AppSettings.objects.get(user=request.user.id)
	except Exception:
		app_settings = init_app_settings(request.user)
	settings = AppSettings.objects.filter(user=request.user.id)
	settings.update(layout="1", sidebar_color="1", color_theme="white", mini_sidebar="off", 
		sticky_header="on")
	return JsonResponse(***REMOVED***"success": "Settings Updated"***REMOVED***, status=200)


def init_app_settings(user):
	app = AppSettings(user=user, app_name="Malone", layout="1", sidebar_color="1", color_theme="white", 
		mini_sidebar="false", sticky_header="true")
	app.save()
	return app

