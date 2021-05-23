from django.urls import path
# from .views import projects_all, retrieve_project, store_project, user_projects_all
from . import views

urlpatterns = [
    path('api/project_list/', views.projects_all),
    path('api/project/', views.store_project),
    path('api/gps/', views.store_gps),
    path('api/test/', views.test),
    # path('api/projects/user/<int:usr_id>', user_projects_all),
    # path('api/project/user/<int:usr_id>/project/<int:project_id>/flight/<int:flight_id>', retrieve_project),
    path('task/<str:random_id>', views.wmq_params_gps, name='wmq'),
    path('api/gps_load/<int:task_id>', views.load_gps),
    # path('wmq/user/<int:usr_id>/project/<int:project_id>/flight/<int:flight_id>', views.wmq_params, name='wmq2'),
]
