from django.urls import path

from . import views

urlpatterns = [
	path('', views.home, name='admin-home'),
	path('messages/', views.messages, name='admin-messages'),

	path('profile/', views.profile, name='admin-profile'),
	path('edit/profile/', views.edit_profile, name='admin-profile-edit'),

	path('projects/', views.projects, name='admin-projects'),
	path('project/', views.project, name='admin-project'),
	path('edit/project/', views.project_edit, name='admin-project-edit'),

	path('work/', views.work, name='admin-work'),
	path('education/', views.education, name='admin-education'),
	path('skills/', views.skills, name='admin-skills'),
	path('services/', views.services, name='admin-services'),

	path('blog/', views.blog, name='admin-blog'),
	path('edit/blog/', views.edit_blog, name='admin-blog-edit'),

	path('settings/', views.settings, name='admin-settings'),

	path('layout/', views.layout_settings, name = 'layout-settings'),
	path('sidebar-color/', views.sidebar_color_settings, name = 'sidebar-color-settings'),
	path('color-theme/', views.color_theme_settings, name = 'color-theme-settings'),
	path('sidebar-toggle/', views.sidebar_toggle, name = 'sidebar-toggle'),
	path('sticky-header/', views.sticky_header, name = 'sticky-header'),
	path('restore-default/', views.restore_default, name = 'restore-default'),

	path('logout/', views.logout, name='logout'),
]