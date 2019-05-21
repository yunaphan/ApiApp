from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sessions.backends.db import SessionStore
from django.shortcuts import redirect


# Create your views here.
def index_login(request):
    if request.session.has_key('user'):
        return redirect('ubg/')
    else:
        return render(request, 'login.html')


@csrf_exempt
def dangnhap(request):
    refcur = connections['AccountsSys'].cursor()

    data = dict()
    p_user = request.POST['username']
    p_pass = request.POST['password']

    refcur.execute("""select * from dbo.users where username= %s and password = %s and enabled = 1""", (p_user, p_pass))
    data['trangthai'] = refcur.fetchall()
    if not data['trangthai']:
        data['trangthai'] = 'Đăng nhập sai tài khoản hoặc mật khẩu! '
        data['error'] = True
        return JsonResponse(data)
    else:
        request.session['user'] = data['trangthai']
        data['error'] = False
        return redirect('ubg/')
