from django.http import request
from django.shortcuts import render
from django.db import connections

def myprofile(request):
    return render(request, 'pages/profile/myProfile.html')