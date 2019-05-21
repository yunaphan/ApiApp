# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.forms import ModelForm
from django import forms


class Cayxanh(models.Model):
    objectid = models.IntegerField(db_column='OBJECTID', primary_key=True)  # Field name made lowercase.
    sohieu = models.CharField(db_column='SoHieu', max_length=50, blank=True, null=True)  # Field name made lowercase.
    matencx = models.CharField(db_column='MaTenCX', max_length=10, blank=True, null=True)  # Field name made lowercase.
    kinhdo = models.DecimalField(db_column='KinhDo', max_digits=31, decimal_places=10, blank=True, null=True)  # Field name made lowercase.
    vido = models.DecimalField(db_column='ViDo', max_digits=31, decimal_places=10, blank=True, null=True)  # Field name made lowercase.
    duongkinh = models.DecimalField(db_column='DuongKinh', max_digits=31, decimal_places=10, blank=True, null=True)  # Field name made lowercase.
    chieucao = models.DecimalField(db_column='ChieuCao', max_digits=31, decimal_places=10, blank=True, null=True)  # Field name made lowercase.
    dorongtan = models.DecimalField(db_column='DoRongTan', max_digits=31, decimal_places=10, blank=True, null=True)  # Field name made lowercase.
    ngaytrong = models.DateTimeField(db_column='NgayTrong', blank=True, null=True)  # Field name made lowercase.
    ngaycapnhat = models.DateTimeField(db_column='NgayCapNhat', blank=True, null=True)  # Field name made lowercase.
    thuoctinh = models.CharField(db_column='ThuocTinh', max_length=50, blank=True, null=True)  # Field name made lowercase.
    ghichu = models.CharField(db_column='GhiChu', max_length=50, blank=True, null=True)  # Field name made lowercase.
    matinhtrang = models.IntegerField(db_column='MaTinhTrang', blank=True, null=True)  # Field name made lowercase.
    tuyenduong = models.CharField(db_column='TuyenDuong', max_length=20, blank=True, null=True)  # Field name made lowercase.
    shape = models.TextField(db_column='Shape', blank=True, null=True)  # Field name made lowercase. This field type is a guess.
    nvks_x = models.DecimalField(db_column='NVKS_X', max_digits=38, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    nvks_y = models.DecimalField(db_column='NVKS_Y', max_digits=38, decimal_places=8, blank=True, null=True)  # Field name made lowercase.
    nguoicapnhat = models.CharField(db_column='NguoiCapNhat', max_length=200, blank=True, null=True)  # Field name made lowercase.
    xoabo = models.CharField(db_column='Xoabo', max_length=1, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'CAYXANH'

class ThemCayXanhForm(forms.ModelForm):
    class Meta:
        model = Cayxanh
        fields = ['objectid', 'sohieu', 'matencx', 'kinhdo', 'vido', 'duongkinh', 'chieucao', 'dorongtan', 'ngaytrong', 'ngaycapnhat', 'thuoctinh', 'ghichu', 'matinhtrang', 'tuyenduong', 'nvks_x', 'nvks_y', 'nguoicapnhat','xoabo']
        widgets = {
            'objectid': forms.NumberInput(attrs={'class': 'objetcid'}),
            'sohieu': forms.TextInput(attrs={'class': 'form-control'})
        }