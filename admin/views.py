from django.shortcuts import render, redirect

from django.http import HttpResponse, JsonResponse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.utils.text import slugify
from django.core.paginator import Paginator

from profile_settings.models import (
    Profile,
    Project,
    SocialLink,
    Education,
    Work,
    Skill,
    Service,
    Pricing,
    Message,
    AppSettings,
    ProjectImage,
    EmailApp,
    ProjectKeyword,
    WorkHighlight,
    SkillKeyword,
    PricingKeyword,
    TechnicalSkillHighlight,
    ProfessionalSkillHighlight,
)
from profile_settings.forms import (
    ProfileForm,
    ProjectForm,
    WorkForm,
    EducationForm,
    AppSettingsForm,
    ProjectImageForm,
)
from blog.models import ArticleSeries, ArticleCategory, Article, Comment, CommentReply
from blog.forms import ArticleForm


def check_profile(user):
    profile = Profile.objects.filter(user=user.id)
    return profile.count() >= 1


def check_settings(user):
    app = AppSettings.objects.filter(user=user.id)
    return app.count() >= 1


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def home(request):
    app = AppSettings.objects.get(user=request.user.id)
    profile = Profile.objects.get(user=request.user.id)
    return render(request, "admin/home.html", {"profile": profile, "app": app})


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def messages(request):
    app = AppSettings.objects.get(user=request.user.id)
    profile = Profile.objects.get(user=request.user.id)
    messages = Message.objects.all().order_by("date_created").reverse()
    return render(
        request,
        "admin/messages.html",
        {"profile": profile, "app": app, "messages": messages},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def profile(request):
    profile = Profile.objects.get(user=request.user.id)
    socials = SocialLink.objects.filter(profile=profile.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/profile-view.html",
        {"profile": profile, "socials": socials, "app": app},
    )


@login_required(login_url="/login/")
def edit_profile(request):
    app = AppSettings.objects.filter(user=request.user.id)
    if app.exists():
        app = app[0]
    else:
        app = init_app_settings(request.user)

    profiles = Profile.objects.filter(user=request.user.id)
    if profiles.exists():
        profile = profiles[0]
        form = ProfileForm(instance=profile)
        socials = SocialLink.objects.filter(profile=profile.id)
    else:
        profile = None
        socials = None
        form = ProfileForm(
            {
                "user": request.user.id,
                "first_name": request.user.first_name,
                "second_name": request.user.last_name,
                "email": request.user.email,
            }
        )

    # Check if request is from a form
    if request.method == "POST":
        # Add profile if it does not exist
        # Update profile if If EXIST
        if profile is None:
            form = ProfileForm(request.POST, request.FILES)
        else:
            form = ProfileForm(request.POST, request.FILES, instance=profile)

        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)

        user = request.user
        user.last_name = request.POST["second_name"]
        user.first_name = request.POST["first_name"]
        user.email = request.POST["email_1"]
        user.save()

        profile = Profile.objects.get(user=request.user.id)
        # Update Social links
        if socials is not None:
            for social in socials:
                name = request.POST["name-" + str(social.id)]
                logo = request.POST["logo-" + str(social.id)]
                url = request.POST["url-" + str(social.id)]
                social.name = name
                social.logo = logo
                social.url = url
                social.save()

        # Add New Social Links
        # Get the number of new social links
        form_num = int(request.POST["form_num"])
        form_num = form_num + 1
        # Loop through all the new social items
        for x in range(1, form_num):
            try:
                name = request.POST["name_" + str(x)]
                logo = request.POST["logo_" + str(x)]
                url = request.POST["url_" + str(x)]
                social = SocialLink(profile=profile, name=name, logo=logo, url=url)
                social.save()
            except Exception as e:
                print(e)
        return redirect("admin-profile")
    else:
        return render(
            request,
            "admin/profile-edit.html",
            {"profile": profile, "form": form, "app": app, "socials": socials},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def social_link_delete(request, slug, social_id):
    social = SocialLink.objects.filter(id=int(social_id))
    if social.count() > 0:
        if social[0].profile.user.id == request.user.id:
            social.delete()
            return redirect("admin-profile")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def projects(request):
    profile = Profile.objects.get(user=request.user.id)
    projects = Project.objects.filter(profile=profile.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/projects.html",
        {"profile": profile, "projects": projects, "app": app},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def project(request, slug, project_id):
    project = Project.objects.get(id=int(project_id))
    app = AppSettings.objects.get(user=request.user.id)
    profile = Profile.objects.get(user=request.user.id)
    return render(
        request,
        "admin/project.html",
        {"project": project, "app": app, "profile": profile},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def project_edit(request, slug, project_id):
    # Get profile and project data
    profile = Profile.objects.get(user=request.user.id)
    project = Project.objects.get(id=int(project_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the project data if request from a form
        form = ProjectForm(request.POST, request.FILES, instance=project)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)

        # Update Project Keywords
        keywords = request.POST["keywords"]
        keywords_dic = keywords.split(",")
        # Get old keywords and Delete them
        project_keywords = ProjectKeyword.objects.filter(project=project.id)
        project_keywords.delete()
        # Add new keywords
        for keyword in keywords_dic:
            new_keyword = ProjectKeyword(project=project, technology=keyword.strip())
            new_keyword.save()

        # Add New Project Images
        p = {"project": project.id}
        form_pic = ProjectImageForm(p, request.FILES)
        new_images = request.FILES.getlist("picture")
        if form_pic.is_valid():
            for image in new_images:
                project_image = ProjectImage(project=project, picture=image)
                # ProjectImageForm(project=project.id, picture=image)
                project_image.save()

        return redirect("admin-project", slugify(project.name), project.id)
    else:
        state = "EDIT_STATE"
        form = ProjectForm(instance=project)
        form_set = []

        for img in project.images():
            image_form = ProjectImageForm(instance=img)
            []
            form_set += [[img, image_form]]
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/project-edit.html",
            {
                "profile": profile,
                "state": state,
                "project": project,
                "form_set": form_set,
                "form": form,
                "app": app,
            },
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def project_add(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        project = None
        form = ProjectForm(request.POST, request.FILES)
        if form.is_valid():
            project = form.save()
        else:
            return HttpResponse(form.errors)

        # Add new Project Keywords
        keywords = request.POST["keywords"]
        keywords_dic = keywords.split(",")
        for keyword in keywords_dic:
            new_keyword = ProjectKeyword(project=project, technology=keyword.strip())
            new_keyword.save()

        # Update Project Images
        p = {"project": project.id}
        form_pic = ProjectImageForm(p, request.FILES)
        new_images = request.FILES.getlist("picture")
        if form_pic.is_valid():
            for image in new_images:
                project_image = ProjectImage(project=project, picture=image)
                # ProjectImageForm(project=project.id, picture=image)
                project_image.save()

        return redirect("admin-project", slugify(project.name), project.id)
    else:
        state = "ADD_STATE"
        form = ProjectForm()
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/project-edit.html",
            {"profile": profile, "state": state, "form": form, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def project_delete(request, slug, project_id):
    projects = Project.objects.filter(id=int(project_id))
    if projects.count() > 0:
        if projects[0].profile.user.id == request.user.id:
            projects.delete()
            return redirect("admin-projects")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def project_image_update(request, slug, image_id):
    image = ProjectImage.objects.get(id=int(image_id))
    if request.method == "POST":
        # Update Project Images
        form = ProjectImageForm(request.POST, request.FILES, instance=image)
        if form.has_changed():
            if form.is_valid():
                form.save()
            else:
                print(form.errors)
        else:
            print("=-----Not Changed")

        return redirect("admin-project", slug, image.project.id)
    else:
        print("check point-3")
        return redirect("admin-project", slug, image.project.id)


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def project_image_delete(request, slug, image_id):
    image = ProjectImage.objects.filter(id=int(image_id))
    if image.count() > 0:
        project = image[0].project
        if image[0].project.profile.user.id == request.user.id:
            image.delete()
            return redirect("admin-project", slug, project.id)
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def work(request):
    profile = Profile.objects.get(user=request.user.id)
    work = Work.objects.filter(profile=profile.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/work.html",
        {"work_history": work, "profile": profile, "app": app},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def edit_work(request, slug, work_id):
    profile = Profile.objects.get(user=request.user.id)
    work = Work.objects.get(id=int(work_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the work data if request from a form
        form = WorkForm(request.POST, instance=work)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)

        # Update Work Highlights
        highlights = WorkHighlight.objects.filter(work=work.id)
        for highlight in highlights:
            name = request.POST["name-" + str(highlight.id)]
            highlight.name = name
            highlight.save()

        # Add New Work Highlights
        # Get the number of new Work Highlights
        form_num = int(request.POST["form_num"])
        form_num = form_num + 1
        # Loop through all the new social items
        for x in range(1, form_num):
            try:
                name = request.POST["name_" + str(x)]
                highlight = WorkHighlight(work=work, name=name)
                highlight.save()
            except Exception as e:
                print(e)
        return redirect("admin-work")
    else:
        state = "EDIT_STATE"
        form = WorkForm(instance=work)
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/work-edit.html",
            {
                "profile": profile,
                "state": state,
                "work": work,
                "form": form,
                "app": app,
            },
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def add_work(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        work = None
        form = WorkForm(request.POST)
        if form.is_valid():
            work = form.save()
        else:
            return HttpResponse(form.errors)

        # Add new Work Highlights
        # Get the number of new Work Highlights
        form_num = int(request.POST["form_num"])
        form_num = form_num + 1
        # Loop through all the new social items
        for x in range(1, form_num):
            try:
                name = request.POST["name_" + str(x)]
                highlight = WorkHighlight(work=work, name=name)
                highlight.save()
            except Exception as e:
                print(e)

        return redirect("admin-work")
    else:
        state = "ADD_STATE"
        form = WorkForm()
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/work-edit.html",
            {"profile": profile, "form": form, "state": state, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def delete_work(request, slug, work_id):
    work = Work.objects.filter(id=int(work_id))
    if work.count() > 0:
        if work[0].profile.user.id == request.user.id:
            work.delete()
            return redirect("admin-work")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def work_highlight_delete(request, slug, highlight_id):
    highlights = WorkHighlight.objects.filter(id=int(highlight_id))
    if highlights.count() > 0:
        if highlights[0].work.profile.user.id == request.user.id:
            highlights.delete()
            return redirect("admin-work")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def education(request):
    profile = Profile.objects.get(user=request.user.id)
    edu = Education.objects.filter(profile=profile.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/education.html",
        {"profile": profile, "edu_history": edu, "app": app},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def edit_education(request, slug, edu_id):
    profile = Profile.objects.get(user=request.user.id)
    edu = Education.objects.get(id=int(edu_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the Education data if request from a form
        form = EducationForm(request.POST, instance=edu)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)

        return redirect("admin-education")
    else:
        state = "EDIT_STATE"
        form = EducationForm(instance=edu)
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/education-edit.html",
            {"profile": profile, "form": form, "state": state, "edu": edu, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def add_education(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        form = EducationForm(request.POST)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)
        return redirect("admin-education")
    else:
        state = "ADD_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/education-edit.html",
            {"profile": profile, "state": state, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def delete_education(request, slug, edu_id):
    edu = Education.objects.filter(id=int(edu_id))
    if edu.count() > 0:
        if edu[0].profile.user.id == request.user.id:
            edu.delete()
            return redirect("admin-education")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills(request):
    profile = Profile.objects.get(user=request.user.id)
    skills = Skill.objects.filter(profile=profile.id)
    tech_skills = TechnicalSkillHighlight.objects.all()
    prof_skills = ProfessionalSkillHighlight.objects.all()
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/skills.html",
        {
            "profile": profile,
            "skills": skills,
            "app": app,
            "tech_skills": tech_skills,
            "prof_skills": prof_skills,
        },
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_edit(request, slug, skill_id):
    # Get profile and project data
    # profile = Profile.objects.get(user=request.user.id)
    skill = Skill.objects.get(id=int(skill_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the project data if request from a form
        name = request.POST["name"]
        description = request.POST["description"]
        skill.name = name
        skill.description = description
        skill.save()

        # Update Project Keywords
        keywords = request.POST["keywords"]
        keywords_dic = keywords.split(",")
        # Get old keywords and Delete them
        skill_keywords = SkillKeyword.objects.filter(skill=skill.id)
        skill_keywords.delete()
        # Add new keywords
        for keyword in keywords_dic:
            new_keyword = SkillKeyword(skill=skill, name=keyword)
            new_keyword.save()
        return redirect("admin-skills")
    else:
        state = "EDIT_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/skills-edit.html",
            {"state": state, "skill": skill, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_technical_add(request):
    if request.method == "POST":
        # Get form data
        percentage = int(request.POST["percentage"])
        keyword_id = int(request.POST["skill_keyword"])
        keyword = SkillKeyword.objects.get(id=keyword_id)
        tech_skill = TechnicalSkillHighlight(
            skill_keyword=keyword, percentage=percentage
        )
        tech_skill.save()
        return redirect("admin-skills")
    else:
        return redirect("admin-skills")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_technical_edit(request):
    if request.method == "POST":
        # Get form data
        percentage = int(request.POST["percentage"])
        keyword_id = int(request.POST["skill_keyword"])
        tech_skill_id = int(request.POST["tech_skill_id"])
        # Update TechnicalSkillHighlight
        keyword = SkillKeyword.objects.get(id=keyword_id)
        tech_skill = TechnicalSkillHighlight.objects.get(id=tech_skill_id)
        tech_skill.skill_keyword = keyword
        tech_skill.percentage = percentage
        tech_skill.save()
        return redirect("admin-skills")
    else:
        return redirect("admin-skills")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_delete_edit(request, tech_id):
    tech_skill = TechnicalSkillHighlight.objects.get(id=tech_id)
    if tech_skill.skill_keyword.skill.profile.user.id == request.user.id:
        tech_skill.delete()
        return redirect("admin-skills")
    else:
        return HttpResponse("Request Denied.")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_add(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        # Add New Skill
        name = request.POST["name"]
        description = request.POST["description"]
        skill = Skill(profile=profile, name=name, description=description)
        skill.save()
        # Add new Keywords
        keywords = request.POST["keywords"]
        keywords_dic = keywords.split(",")
        for keyword in keywords_dic:
            new_keyword = SkillKeyword(skill=skill, name=keyword)
            new_keyword.save()
        return redirect("admin-skills")
    else:
        state = "ADD_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/skills-edit.html",
            {"app": app, "state": state, "profile": profile},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_delete(request, slug, skill_id):
    skills = Skill.objects.filter(id=int(skill_id))
    if skills.count() > 0:
        if skills[0].profile.user.id == request.user.id:
            skills.delete()
            return redirect("admin-skills")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_professional_add(request):
    if request.method == "POST":
        # Get form data
        percentage = int(request.POST["percentage"])
        name = request.POST["name"]
        profile = Profile.objects.get(user=request.user.id)
        skill = ProfessionalSkillHighlight(
            profile=profile, name=name, percentage=percentage
        )
        skill.save()
        return redirect("admin-skills")
    else:
        return redirect("admin-skills")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_professional_edit(request):
    if request.method == "POST":
        # Get form data
        percentage = int(request.POST["percentage"])
        name = request.POST["name"]
        skill_id = int(request.POST["prof_skill_id"])
        # Update TechnicalSkillHighlight
        skill = ProfessionalSkillHighlight.objects.get(id=skill_id)
        skill.name = name
        skill.percentage = percentage
        skill.save()
        return redirect("admin-skills")
    else:
        return redirect("admin-skills")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def skills_professional_delete(request, prof_id):
    skills = ProfessionalSkillHighlight.objects.filter(id=prof_id)
    if skills.count() > 0:
        if skills[0].profile.user.id == request.user.id:
            skills.delete()
            return redirect("admin-skills")
        else:
            return HttpResponse("Request Denied.")
    else:
        return HttpResponse("No Data to Remove.")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def services(request):
    # Get profile and service data
    profile = Profile.objects.get(user=request.user.id)
    services = Service.objects.filter(profile=profile.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/services.html",
        {"profile": profile, "services": services, "app": app},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def services_edit(request, slug, service_id):
    # Get profile and service data
    profile = Profile.objects.get(user=request.user.id)
    service = Service.objects.get(id=int(service_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the Service data if request from a form
        name = request.POST["name"]
        logo = request.POST["logo"]
        description = request.POST["description"]
        service.name = name
        service.logo = logo
        service.description = description
        service.save()
        return redirect("admin-services")
    else:
        state = "EDIT_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/services-edit.html",
            {"service": service, "profile": profile, "state": state, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def services_add(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        # Add New Services
        name = request.POST["name"]
        logo = request.POST["logo"]
        description = request.POST["description"]
        service = Service(
            profile=profile, name=name, logo=logo, description=description
        )
        service.save()
        return redirect("admin-services")
    else:
        state = "ADD_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/services-edit.html",
            {"profile": profile, "state": state, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def services_delete(request, slug, service_id):
    services = Service.objects.filter(id=int(service_id))
    if services.count() > 0:
        if services[0].profile.user.id == request.user.id:
            services.delete()
            return redirect("admin-services")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def prices(request):
    # Get profile and price data
    profile = Profile.objects.get(user=request.user.id)
    pricing = Pricing.objects.filter(profile=profile.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/prices.html",
        {"prices": pricing, "profile": profile, "app": app},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def price_edit(request, slug, price_id):
    # Get profile and price data
    profile = Profile.objects.get(user=request.user.id)
    pricing = Pricing.objects.get(id=int(price_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the Service data if request from a form
        name = request.POST["name"]
        price = request.POST["price"]
        description = request.POST["description"]
        pricing.name = name
        pricing.price = price
        pricing.description = description
        pricing.save()
        # Update Pricing Keyword
        keywords = PricingKeyword.objects.filter(pricing=pricing.id)
        for keyword in keywords:
            price = request.POST["price-" + int(keyword.id)]
            status = request.POST["status-" + int(keyword.id)]
            keyword.price = price
            keyword.status = status
            keyword.save()

        # Add New Keywords
        # Get the number of new Work Highlights
        form_num = int(request.POST["form_num"])
        form_num = form_num + 1
        # Loop through all the new social items
        for x in range(1, form_num):
            # try:
            name = request.POST["name_" + str(x)]
            status = request.POST["status_" + str(x)]
            keyword = PricingKeyword(pricing=pricing, name=name, status=status)
            keyword.save()
            # except Exception:
            # 	pass

        return redirect("admin-prices")
    else:
        state = "EDIT_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/price-edit.html",
            {"price": pricing, "profile": profile, "state": state, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def price_add(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        # Add New Pricing
        name = request.POST["name"]
        price = float(request.POST["price"])
        description = request.POST["description"]
        price = Pricing(
            profile=profile, name=name, price=price, description=description
        )
        price.save()

        # Add New Keywords
        # Get the number of new Keywords
        form_num = int(request.POST["form_num"])
        form_num = form_num + 1
        # Loop through all the new Keywords items
        for x in range(1, form_num):
            try:
                name = request.POST["name_" + str(x)]
                status = request.POST["status_" + str(x)]
                keyword = PricingKeyword(pricing=price, name=name, status=status)
                keyword.save()
            except Exception as e:
                print(e)

        return redirect("admin-prices")
    else:
        state = "ADD_STATE"
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/price-edit.html",
            {"profile": profile, "state": state, "app": app},
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def price_delete(request, slug, price_id):
    prices = Pricing.objects.filter(id=int(price_id))
    if prices.count() > 0:
        if prices[0].profile.user.id == request.user.id:
            prices.delete()
            return redirect("admin-prices")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("No Data to Remove")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def blog(request):
    # Initialize Profile and app Data
    profile = Profile.objects.get(user=request.user.id)
    app = AppSettings.objects.get(user=request.user.id)
    # Get Article Data
    articles = Article.objects.all()
    categories = ArticleCategory.objects.all()
    series = ArticleSeries.objects.all()
    # Number of Publish, Draft, Pending, Trash
    status_count = {}
    publish = articles.filter(status="Publish").count()
    status_count.setdefault("publish", publish)
    draft = articles.filter(status="Draft").count()
    status_count.setdefault("draft", draft)
    pending = articles.filter(status="Pending").count()
    status_count.setdefault("pending", pending)
    trash = articles.filter(status="Trash").count()
    status_count.setdefault("trash", trash)
    # Set Up Pagination
    paginator = Paginator(articles, 10)
    page_number = request.GET.get("page", 1)
    articles = paginator.get_page(page_number)

    return render(
        request,
        "admin/blog-view.html",
        {
            "profile": profile,
            "articles": articles,
            "series": series,
            "categories": categories,
            "app": app,
            "status_count": status_count,
        },
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def edit_blog(request, slug, article_id):
    profile = Profile.objects.get(user=request.user.id)
    article = Article.objects.get(id=int(article_id))
    # Check if request is from a form
    if request.method == "POST":
        # Update the Education data if request from a form
        form = ArticleForm(request.POST, request.FILES, instance=article)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)
        return redirect("admin-blog")
    else:
        state = "EDIT_STATE"
        form = ArticleForm(instance=article)
        categories = ArticleCategory.objects.all()
        series = ArticleSeries.objects.all()
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/blog-edit.html",
            {
                "state": state,
                "form": form,
                "article": article,
                "profile": profile,
                "categories": categories,
                "series": series,
                "app": app,
            },
        )


def trash_blog(request, slug, article_id):
    articles = Article.objects.filter(id=int(article_id))
    if articles.count() > 0:
        if articles[0].user.id == request.user.id:
            article = articles[0]
            article.status = "Trash"
            article.save()
            return redirect("admin-blog")
        else:
            return HttpResponse("Access Denied")
    else:
        return HttpResponse("Article Does Not Exist")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def add_blog(request):
    profile = Profile.objects.get(user=request.user.id)
    if request.method == "POST":
        form = ArticleForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)
        return redirect("admin-blog")
    else:
        state = "ADD_STATE"
        form = ArticleForm()
        categories = ArticleCategory.objects.all()
        series = ArticleSeries.objects.all()
        app = AppSettings.objects.get(user=request.user.id)
        return render(
            request,
            "admin/blog-edit.html",
            {
                "state": state,
                "profile": profile,
                "form": form,
                "categories": categories,
                "series": series,
                "app": app,
            },
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
def add_category(request):
    if request.is_ajax():
        form_num = int(request.POST["form_num"])
        form_num = form_num + 1
        for x in range(1, form_num):
            # try:
            name = request.POST["category-name_" + str(x)]
            category = ArticleCategory(name=name)
            category.save()
            # except Exception:
            # 	name = ''
        return JsonResponse({"success": "Category Created"}, status=200)
    else:
        return redirect("admin-blog")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
def add_series(request):
    if request.is_ajax():
        form_num = int(request.POST["form_num-series"])
        form_num = form_num + 1
        for x in range(1, form_num):
            # try:
            name = request.POST["series-name_" + str(x)]
            series = ArticleSeries(name=name)
            series.save()
            # except Exception:
            # 	name = ''
        return JsonResponse({"success": "Series Created"}, status=200)
    else:
        return redirect("admin-blog")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def blog_comments(request, slug, article_id):
    # Get Comments - Comment, CommentReply
    comments = Comment.objects.filter(article=int(article_id))
    # Get Profile and App Settings
    profile = Profile.objects.get(user=request.user.id)
    app = AppSettings.objects.get(user=request.user.id)
    return render(
        request,
        "admin/blog-comments.html",
        {"app": app, "profile": profile, "comments": comments},
    )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def delete_comment(request, comment_id):
    comments = Comment.objects.filter(id=int(comment_id))
    if comments.count() > 0:
        if request.user.is_superuser:
            article = comments[0].article
            comments.delete()
            return redirect("admin-blog-comments", slugify(article.title), article.id)
        else:
            return HttpResponse("Acction Denied")
    else:
        return HttpResponse("No Such Comment")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
@user_passes_test(check_settings, login_url="/admin/settings/")
def delete_reply(request, reply_id):
    comments = CommentReply.objects.filter(id=int(reply_id))
    if comments.count() > 0:
        if request.user.is_superuser:
            article = comments[0].comment.article
            comments.delete()
            return redirect("admin-blog-comments", slugify(article.title), article.id)
        else:
            return HttpResponse("Acction Denied")
    else:
        return HttpResponse("No Such Comment")


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
def settings(request):
    app_settings = AppSettings.objects.filter(user=request.user.id)
    # app_email = None
    if app_settings.count() == 0:
        init_app_settings(request.user)
    app = AppSettings.objects.get(user=request.user.id)
    if request.method == "POST":
        form = AppSettingsForm(request.POST, request.FILES, instance=app)
        if form.is_valid():
            form.save()
        else:
            return HttpResponse(form.errors)
        return redirect("admin-settings")
    else:
        profile = Profile.objects.get(user=request.user.id)
        app_email = EmailApp.objects.filter(profile=profile.id)
        if app_email.count() > 0:
            app_email = app_email[0]
        else:
            app_email = None
        form = AppSettingsForm(instance=app)
        return render(
            request,
            "admin/settings.html",
            {"app": app, "form": form, "profile": profile, "app_email": app_email},
        )


@login_required(login_url="/login/")
def edit_password(request):
    if request.method == "POST":
        if request.is_ajax():
            usr = request.user
            if usr.check_password(request.POST["old_password"]):
                if request.POST["new_password"] == request.POST["confirm_password"]:
                    if not request.POST["new_password"] == request.POST["old_password"]:
                        usr.set_password(request.POST["new_password"])
                        usr.save()
                        logout(request)
                        return redirect("login")
                    else:
                        return JsonResponse(
                            {"error": "The Password Hasnot cHANGED"}, status=200
                        )
                else:
                    return JsonResponse(
                        {
                            "error": "The Confirm Password and the New Password dont Match"
                        },
                        status=200,
                    )
            else:
                return JsonResponse({"error": "Incorrect Old password"}, status=200)
        else:
            return redirect("admin-change-password")
    else:
        # App Settings
        app_settings = AppSettings.objects.filter(user=request.user.id)
        if app_settings.count() == 0:
            init_app_settings(request.user)
        app = AppSettings.objects.get(user=request.user.id)
        # Profile Settings
        profile = Profile.objects.filter(user=request.user.id)
        if profile.count() > 0:
            profile = profile[0]
        else:
            profile = None

        return render(
            request, "admin/settings-password.html", {"app": app, "profile": profile}
        )


@login_required(login_url="/login/")
@user_passes_test(check_profile, login_url="/admin/edit/profile/")
def email_settings(request):
    if request.method == "POST":
        profile = Profile.objects.get(user=request.user.id)
        app_email = EmailApp.objects.filter(profile=profile.id)
        if app_email.count() > 0:
            app_email = app_email[0]
            app_email.smtp_server = request.POST["smtp_server"]
            app_email.port = request.POST["port"]
            app_email.email = request.POST["email"]
            app_email.password = request.POST["password"]
            app_email.save()
        else:
            app_email = EmailApp(
                profile=profile,
                smtp_server=request.POST["smtp_server"],
                port=request.POST["port"],
                email=request.POST["email"],
                password=request.POST["password"],
            )
            app_email.save()
        return redirect("admin-settings")
    else:
        return redirect("admin-settings")


@login_required(login_url="/login/")
def layout_settings(request):
    layout = str(request.GET["layout"])
    settings = AppSettings.objects.filter(user=request.user.id)

    if not settings.exists():
        init_app_settings(request.user)
        settings = AppSettings.objects.filter(user=request.user.id)

    if layout == "1":
        # light light-sidebar theme-white
        settings.update(layout=layout, sidebar_color="1", color_theme="white")
    elif layout == "2":
        # dark dark-sidebar theme-black
        settings.update(layout=layout, sidebar_color="2", color_theme="black")

    return JsonResponse({"success": "Settings Updated"}, status=200)


@login_required(login_url="/login/")
def sidebar_color_settings(request):
    sidebar = str(request.GET["sidebar"])
    settings = AppSettings.objects.filter(user=request.user.id)

    if not settings.exists():
        settings = init_app_settings(request.user)
        settings.sidebar_color = sidebar
    else:
        settings.update(sidebar_color=sidebar)

    return JsonResponse({"success": "Settings Updated"}, status=200)


@login_required(login_url="/login/")
def color_theme_settings(request):
    settings = AppSettings.objects.filter(user=request.user.id)
    theme = str(request.GET["theme"])

    if not settings.exists():
        settings = init_app_settings(request.user)
        settings.color_theme = theme
        settings.save()
    else:
        settings.update(color_theme=theme)

    return JsonResponse({"success": "Settings Updated"}, status=200)


@login_required(login_url="/login/")
def sidebar_toggle(request):
    sidebar = str(request.GET["sidebar"])
    settings = AppSettings.objects.filter(user=request.user.id)

    if not settings.exists():
        settings = init_app_settings(request.user)
        settings.mini_sidebar = sidebar
        settings.save()
    else:
        settings.update(mini_sidebar=sidebar)

    return JsonResponse({"success": "Settings Updated"}, status=200)


@login_required(login_url="/login/")
def sticky_header(request):
    settings = AppSettings.objects.filter(user=request.user.id)

    header = str(request.GET["header"])

    if not settings.exists():
        settings = init_app_settings(request.user)
        settings.sticky_header = header
        settings.save()
    else:
        settings.update(sticky_header=header)

    return JsonResponse({"success": "Settings Updated"}, status=200)


@login_required(login_url="/login/")
def restore_default(request):
    settings = AppSettings.objects.filter(user=request.user.id)

    if not settings.exists():
        init_app_settings(request.user)
        settings = AppSettings.objects.filter(user=request.user.id)

    settings.update(
        layout="1",
        sidebar_color="1",
        color_theme="white",
        mini_sidebar="off",
        sticky_header="on",
    )
    return JsonResponse({"success": "Settings Updated"}, status=200)


def init_app_settings(user):
    app = AppSettings(
        user=user,
        app_name="Malone",
        layout="1",
        sidebar_color="1",
        color_theme="white",
        mini_sidebar="false",
        sticky_header="true",
    )
    app.save()
    return app
