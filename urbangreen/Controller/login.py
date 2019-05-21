from django.contrib.auth import authenticate, login
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db import connections
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def xulidangnhap(request):
    recur = connections['AccountsSys'].cursor()
    data = dict()
    p_username = request.POST['u_name']
    p_password = request.POST['u_psw']
    data['name'] = p_username
    data['pss'] = p_password
    print(data)
    # try:
    #     recur.execute("{call check_dangnhap('phantien','123456n')}")
    #     data['check_dn'] = recur.fetchall()
    # except (RuntimeError, TypeError, NameError):
    #     print(RuntimeError, TypeError, NameError)
    # finally:
    #     return HttpResponse('Continue Fix!')
    #     recur.close()
    return HttpResponse(data)