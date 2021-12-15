from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test

from profile_settings.models import Profile, Project, SocialLink, Education, Work, Skill, Service
from profile_settings.models import Testimony, Pricing, Message

def index(request):
	profile = Profile.objects.get(user=request.user.id) # Profile data
	socials = SocialLink.objects.filter(profile=profile.id) # Social Media Links
	projects = Project.objects.filter(profile=profile.id).order_by('date').reverse()[0:4] # 4 Recent Projects 
	return render(request, "MyPortfolio/index.html", ***REMOVED***'profile': profile, 'socials': socials, 
		'projects': projects***REMOVED***)


def auth_login(request):
	if request.is_ajax():
		user = authenticate(request, username=request.POST['username'], password=request.POST['password'])
		if user is not None:
			login(request, user)
			user = User.objects.get(username=request.POST['username'])
			try:
				return JsonResponse(***REMOVED***"success": "User logged in", "redirect": request.GET['next']***REMOVED***, status=200)
			except Exception:
				return JsonResponse(***REMOVED***"success": "User logged in"***REMOVED***, status=200)
				# return HttpResponse("logged in")
		else:
			return JsonResponse(***REMOVED***"error": "Invalid username or password"***REMOVED***, status=200)
	else:
		return render(request, "MyPortfolio/login.html")


@login_required(login_url='/login/')
def auth_logout(request):
	logout(request)
	return redirect('login')
