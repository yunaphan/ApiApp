from django.contrib import admin
from django.conf.urls import include, url

urlpatterns = [
    url('ubg/', include('urbangreen.urls')),
    url('', include("login.urls")),
]
