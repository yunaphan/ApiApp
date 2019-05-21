from django.db import connections
from django.http import JsonResponse

def select_QH(request):
    refcur = connections['DoThi'].cursor()
    refcur.execute("select MaQuanHuyen, TenQuanHuyen from sde.QUANHUYEN")
    result = dict()
    result['select_QH'] = refcur.fetchall()
    print(result)
    return JsonResponse(result)

