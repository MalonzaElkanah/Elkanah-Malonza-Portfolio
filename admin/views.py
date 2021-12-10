from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.


def home(request):
	return render(request, 'admin/home.html')

def messages(request):
	return render(request, 'admin/messages.html')

def profile(request):
	return render(request, 'admin/profile-view.html')

def edit_profile(request):
	return render(request, 'admin/profile-edit.html')


def projects(request):
	return render(request, 'admin/projects.html') 

def project(request):
	return render(request, 'admin/project.html')

def project_edit(request):
	return render(request, 'admin/project-edit.html')

def work(request):
	pass

def education(request):
	pass

def skills(request):
	pass 

def services(request):
	pass 

def blog(request):
	return render(request, 'admin/blog-view.html') 

def edit_blog(request):
	return render(request, 'admin/blog-edit.html') 

def settings(request):
	pass 

def logout(request):
	pass 


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


