from django.urls import path
from .Controller import themcayxanh, TC_quanhuyen, myprofile
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.index, name='index'),
    path('searchqh', views.searchqh),
    path('searchlayer', views.layer),
    path('logout/', views.logout, name='logout'),
    path('UBG/create_new_user/', views.create_new_user, name='create_new_user'),
    path('UBG/create/<long>&<lat>/', views.themcaymoi, name='Thêm Cây Mới'),
    path('UBG/them-ten-cay-submit/', views.them_ten_cay, name='Thêm Tên Cây Mới Submit'),
    path('themcayxanh/', themcayxanh.themcayxanh_submit),
    #  Lọc Theo Quận Huyện
    path('locquanhuyen/', TC_quanhuyen.select_QH),
    path('', views.TC_ten, name='tra cứu theo tên cây xanh'),
    path('myprofile/', myprofile.myprofile)
]
