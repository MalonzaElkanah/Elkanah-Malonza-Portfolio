from django.urls import path

from . import views

urlpatterns = [
	path('', views.home, name='admin-home'),
	path('messages/', views.messages, name='admin-messages'),

	path('profile/', views.profile, name='admin-profile'),
	path('edit/profile/', views.edit_profile, name='admin-profile-edit'),

	path('projects/', views.projects, name='admin-projects'),
	path('project/<slug:slug>/<int:project_id>/', views.project, name='admin-project'),
	path('edit/project/<slug:slug>/<int:project_id>/', views.project_edit, name='admin-project-edit'),
	path('add/project/', views.project_add, name='admin-project-add'),

	path('work/', views.work, name='admin-work'),
	path('edit/work/<slug:slug>/<int:work_id>/', views.edit_work, name='admin-work-edit'),
	path('add/work/', views.add_work, name='admin-work-add'),

	path('education/', views.education, name='admin-education'),
	path('edit/education/<slug:slug>/<int:edu_id>/', views.edit_education, name='admin-education-edit'),
	path('add/education/', views.add_education, name='admin-education-add'),

	path('skills/', views.skills, name='admin-skills'),
	path('edit/skills/<slug:slug>/<int:skill_id>/', views.skills_edit, name='admin-skills-edit'),
	path('add/skills/', views.skills_add, name='admin-skills-add'),

	path('services/', views.services, name='admin-services'),
	path('edit/services/', views.services_edit, name='admin-services-edit'),

	path('blog/', views.blog, name='admin-blog'),
	path('edit/blog/', views.edit_blog, name='admin-blog-edit'),

	path('settings/', views.settings, name='admin-settings'),

	path('layout/', views.layout_settings, name = 'layout-settings'),
	path('sidebar-color/', views.sidebar_color_settings, name = 'sidebar-color-settings'),
	path('color-theme/', views.color_theme_settings, name = 'color-theme-settings'),
	path('sidebar-toggle/', views.sidebar_toggle, name = 'sidebar-toggle'),
	path('sticky-header/', views.sticky_header, name = 'sticky-header'),
	path('restore-default/', views.restore_default, name = 'restore-default'),
]