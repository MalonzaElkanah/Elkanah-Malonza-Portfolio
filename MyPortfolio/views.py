from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test

from profile_settings.models import Profile, Project, SocialLink, Education, Work, Skill, Service
from profile_settings.models import Testimony, Pricing, Message, EmailApp
from profile_settings.models import TechnicalSkillHighlight, ProfessionalSkillHighlight
from blog.models import Article

from validate_email import validate_email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib, ssl

def index(request):
	profile = Profile.objects.get(id=1) # Profile data
	socials = SocialLink.objects.filter(profile=profile.id) # Social Media Links
	projects = Project.objects.filter(profile=profile.id).order_by('date').reverse()[0:4] # 4 Recent Projects 
	edu = Education.objects.filter(profile=profile.id)
	work = Work.objects.filter(profile=profile.id)
	skills = Skill.objects.filter(profile=profile.id)
	tech_skills = TechnicalSkillHighlight.objects.all()
	prof_skills = ProfessionalSkillHighlight.objects.all()
	services = Service.objects.filter(profile=profile.id)
	pricing = Pricing.objects.filter(profile=profile.id)
	# 3 Recent Articles 
	articles = Article.objects.filter(status='Publish').order_by('date_created').reverse()[0:3]
	return render(request, "MyPortfolio/index.html", ***REMOVED***'profile': profile, 'socials': socials, 
		'projects': projects, 'education_history': edu, 'work_history': work, 'skills': skills, 
		'services': services, 'pricing': pricing, 'articles': articles, 'tech_skills': tech_skills, 
		'prof_skills': prof_skills***REMOVED***)


def contact_me(request):
	if request.is_ajax():
		# Get form data and Save in DB (first_name, last_name, email, message, status)
		message = Message(first_name = request.POST['first_name'], last_name = request.POST['last_name'], 
			email = request.POST['email'], message = request.POST['message'], status = 'unsend')
		message.save()
		# Get Admin Email Details
		profile = Profile.objects.get(id=1) # Profile data
		email_settings = EmailApp.objects.filter(profile=profile.id)
		if email_settings.count() > 0:
			app_email = email_settings[0]
			smtp_server = app_email.smtp_server
			port = app_email.port  # For starttls
			sender_email = app_email.email
			password = app_email.password
			receiver_email = app_email.profile.email_1

			# Send Email to Admin
			name = str(request.POST['first_name'])+" "+str(request.POST['last_name'])
			email1 = request.POST['email']
			message1 = request.POST['message']
			subject = "Contact-Me Message from " + name
			email_body = """***REMOVED***name***REMOVED***(***REMOVED***email1***REMOVED***) has Send you a message from From Your Portfolio. 
				The message is : 
				'***REMOVED***message1***REMOVED***'.
				
				Please Reply as soon as possible

				Regards, 
				Elkanah's portfolio. 
			""" 
			message = MIMEMultipart("alternative")
			message["Subject"] = subject
			message["From"] = sender_email
			message["To"] = receiver_email
			part = MIMEText(email_body.format(name=name, email1=email1, message1=message1), "plain")
			# Add HTML/plain-text parts to MIMEMultipart message
			message.attach(part)
			# Create a secure SSL context
			context = ssl.create_default_context()
			# Try to log in to server and send email
			try:
				server = smtplib.SMTP(smtp_server,port)
				server.ehlo() # Can be omitted
				server.starttls(context=context) # Secure the connection
				server.ehlo() # Can be omitted
				server.login(sender_email, password)
				# Send email
				server.sendmail(sender_email, receiver_email, message.as_string())				
			except Exception as e:
				# Print any error messages to stdout
				print(e)
			finally:
				server.quit()
			return JsonResponse(***REMOVED***"success": "Message Sent"***REMOVED***, status=200)
		else:
			return JsonResponse(***REMOVED***"error": "An Error Occured"***REMOVED***, status=200)
	else:
		return redirect('index') 

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

