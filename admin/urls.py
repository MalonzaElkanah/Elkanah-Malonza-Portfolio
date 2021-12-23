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
    path('update/image/<slug:slug>/<int:image_id>/', views.project_image_update, name='project-image-update'),
    path('remove/image/<slug:slug>/<int:image_id>/', views.project_image_delete, name='project-image-delete'),

	path('work/', views.work, name='admin-work'),
	path('edit/work/<slug:slug>/<int:work_id>/', views.edit_work, name='admin-work-edit'),
	path('add/work/', views.add_work, name='admin-work-add'),

	path('education/', views.education, name='admin-education'),
	path('edit/education/<slug:slug>/<int:edu_id>/', views.edit_education, name='admin-education-edit'),
	path('add/education/', views.add_education, name='admin-education-add'),

	path('skills/', views.skills, name='admin-skills'),
	path('edit/skills/<slug:slug>/<int:skill_id>/', views.skills_edit, name='admin-skills-edit'),
	path('add/skills/', views.skills_add, name='admin-skills-add'),
	path('technical/add/skills/', views.skills_technical_add, name='admin-skills-technical-add'),
	path('technical/edit/skills/', views.skills_technical_edit, name='admin-skills-technical-edit'),
	path('technical/delete/<int:tech_id>/', views.skills_delete_edit, name='admin-skills-technical-delete'),
	path('professional/add/skills/', views.skills_professional_add, name='admin-skills-professional-add'),
	path('professional/edit/skills/', views.skills_professional_edit, name='admin-skills-professional-edit'),

	path('services/', views.services, name='admin-services'),
	path('edit/services/<slug:slug>/<int:service_id>/', views.services_edit, name='admin-services-edit'),
	path('add/services/', views.services_add, name='admin-services-add'),

	path('prices/', views.prices, name='admin-prices'),
	path('edit/price/<slug:slug>/<int:price_id>/', views.price_edit, name='admin-price-edit'),
	path('add/price/', views.price_add, name='admin-price-add'),

	path('blog/', views.blog, name='admin-blog'),
	path('edit/blog/<slug:slug>/<int:article_id>/', views.edit_blog, name='admin-blog-edit'),
	path('add/blog/', views.add_blog, name='admin-blog-add'),
	path('add-category/', views.add_category, name = 'add-blog-category'),
	path('add-series/', views.add_series, name = 'add-blog-series'),

	path('settings/', views.settings, name='admin-settings'),
	path('email/settings/', views.email_settings, name='admin-email-settings'),

	path('layout/', views.layout_settings, name = 'layout-settings'),
	path('sidebar-color/', views.sidebar_color_settings, name = 'sidebar-color-settings'),
	path('color-theme/', views.color_theme_settings, name = 'color-theme-settings'),
	path('sidebar-toggle/', views.sidebar_toggle, name = 'sidebar-toggle'),
	path('sticky-header/', views.sticky_header, name = 'sticky-header'),
	path('restore-default/', views.restore_default, name = 'restore-default'),
]