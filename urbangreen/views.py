from django.shortcuts import render
from django.shortcuts import redirect
from django.db import connections
from django.http import JsonResponse

def index(request):
    if request.session.has_key('user'):
        user = request.session['user']
        username = user[0][8]
        refcur = connections['DoThi'].cursor()
        refcur.execute("select MaQuanHuyen, TenQuanHuyen from sde.QUANHUYEN")
        data = dict()
        data['Selectqh'] = refcur.fetchall()
        return render(request, 'pages/index.html', {"user": user, "username": username, "Selectqh": data['Selectqh']})
    else:
        return redirect('/')

def logout(request):
    del request.session['user']
    return redirect('/')

def login(request):
    return render(request, 'login/login.html')

def create_new_user(request):
    return render(request, 'login/resigner.html')

def themcaymoi(request, long, lat):
    data = dict()
    data['long'] = long
    data['lat'] = lat
    cursor = cursor1 = connections['DoThi'].cursor()
    cursor.execute("select TenCX, MaTenCX from sde.TenCX")
    tencayxanh = dict()
    tinhtrangcx = dict()
    tencayxanh = cursor.fetchall()
    data['tencayxanh'] = tencayxanh
    cursor1.execute("select MaTinhTrang,TinhTrang from sde.TrangThaiCX")
    tinhtrangcx = cursor1.fetchall()
    data['tinhtrang'] = tinhtrangcx
    return render(request, 'pages/ThemCayXanh.html', data)

def them_ten_cay(request):
    maten = request.POST['matencx']
    tencx = request.POST['tencx']
    them_ten = connections['DoThi'].cursor()
    them_ten.execute("insert into sde.TenCX(MaTenCX, TenCX) values (%s,%s)", [maten, tencx])
    return redirect('/ubg', success='Thêm cây mới thành công!')

def TC_ten(request):
    refcur = connections['DoThi'].cursor()
    refcur.execute("select TenCX, MaTenCX from sde.TenCX")
    data = dict()
    data['TC_ten'] = refcur.fetchall()
    print(data['TC_ten'])
    return render(request, 'pages/nav.html', data)

def searchqh(request):
    data = dict()
    message = request.GET['message']
    refcur = connections['DoThi'].cursor()
    if message == '':
        refcur.execute("select MaQuanHuyen, TenQuanHuyen from sde.QUANHUYEN")
    else:
        refcur.execute("select MaQuanHuyen, TenQuanHuyen from sde.QUANHUYEN where TenQuanHuyen LIKE %s", [message])
    data['resultqh'] = refcur.fetchall()
    return JsonResponse(data)






