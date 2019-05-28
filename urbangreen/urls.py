from django.urls import path
from rest_framework import routers
from .Controller import TC_quanhuyen, api
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.index, name='index'),
    path('searchqh', views.searchqh),
    path('logout/', views.logout, name='logout'),
    path('locquanhuyen/', TC_quanhuyen.select_QH),
    path('api/tencayxanh/', api.TenCayXanh1),
    path('', views.TC_ten, name='tra cứu theo tên cây xanh'),

]
