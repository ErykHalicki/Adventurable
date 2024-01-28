from django.urls import path
from . import views

urlpatterns = [
    path('submit/', views.submit_form, name='submit_form'),
    path('info/', views.info, name='info'),
    path('', views.main_page, name='main_page'),
    path('planner', views.planner, name='planner'),
    path('results', views.results, name='results'),
]
