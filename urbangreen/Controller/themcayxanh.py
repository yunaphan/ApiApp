from django.db import connections
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from urbangreen.models.CayXanh_Model import Cayxanh
from django.shortcuts import render
from django import forms

# def themcaymoiSubmit(request,long,lat):
#     print("hello form submited")
#
#     SoHieu = request.POST['SoHieu']
#     TenCX = request.POST['TenCX']
#     KinhDo = request.POST['KinhDo']
#     ViDo = request.POST['ViDo']
#     DuongKinh = request.POST['DuongKinh']
#     ChieuCao = request.POST['ChieuCao']
#     DoRongTan = request.POST['DoRongTan']
#     NgayTrong = request.POST['NgayTrong']
#     NgayCapNhat = request.POST['NgayCapNhat']
#     ThuocTinh = request.POST['ThuocTinh']
#     GhiChu = request.POST['GhiChu']
#     MaTinhTrang = request.POST['MaTinhTrang']
#     TuyenDuong = request.POST['TuyenDuong']
#     NVKS_X = request.POST['NVKS_X']
#     NVKS_Y = request.POST['NVKS_Y']
#     NguoiCapNhat = request.POST['NguoiCapNhat']
#
#     them = connections['DoThi'].cursor()
#     them.execute("insert into sde.CAYXANH(SoHieu, MaTenCX, KinhDo, ViDo) values(%s, %s, %f, %f)",
#                  [SoHieu, TenCX, KinhDo, ViDo])
# #     print("success!")
#     return render(request, 'pages/ThemCayXanh.html', )
@csrf_exempt
def themcayxanh_submit(request):
    data = dict()

    data['SoHieu'] = SoHieu = request.POST['SoHieu']
    data['lat']  = request.POST['lat']
    data['long']   = request.POST['long']
    data['NgayTrong'] = request.POST['NgayTrong']
    data['NgayCapNhat'] = request.POST['NgayCapNhat']
    data['thuocTinh'] = request.POST['thuocTinh']
    data['MaTenCX'] = request.POST['MaTenCX']
    data['MaTinhTrang'] = request.POST['MaTinhTrang']
    data['TuyenDuong'] = request.POST['TuyenDuong']
    data['GhiChu'] = request.POST['GhiChu']
    data['DuongKinh'] = request.POST['DuongKinh']
    data['ChieuCao'] = request.POST['ChieuCao']
    data['DoRongTan'] = request.POST['DoRongTan']
    data['NVKS_X'] = request.POST['NVKS_X']
    data['NVKS_Y'] = request.POST['NVKS_Y']
    user = request.session['user']
    data['NguoiCapNhat'] = user[0][0]
    refcur = connections['DoThi'].cursor()
    refcur.execute("insert into sde.CAYXANH(SoHieu) values(%s)",('CT1111'))
    # refcur.execute("""
    #                     insert into sde.CAYXANH(SoHieu, MaTenCX, KinhDo, ViDo, DuongKinh, ChieuCao, DoRongTan, NgayTrong, ThuocTinh, GhiChu, MaTinhTrang, TuyenDuong, NVKS_X, NVKS_Y, NguoiCapNhat )
    #                     values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
    #                data['sohieu'],data['MaTenCX'],data['long'],data['lat'],data['DuongKinh'],data['ChieuCao'],data['DoRongTan'],data['NgayTrong'],data['thuocTinh'],data['GhiChu'],data['MaTinhTrang'],data['TuyenDuong'],data['NVKS_X'],data['NVKS_Y'],data['NguoiCapNhat'])
    return JsonResponse(data)