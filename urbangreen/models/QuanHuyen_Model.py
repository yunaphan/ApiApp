# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Quanhuyen(models.Model):
    objectid = models.IntegerField(db_column='OBJECTID', primary_key=True)  # Field name made lowercase.
    maquanhuyen = models.CharField(db_column='MaQuanHuyen', max_length=20, blank=True, null=True)  # Field name made lowercase.
    tenquanhuyen = models.CharField(db_column='TenQuanHuyen', max_length=20, blank=True, null=True)  # Field name made lowercase.
    matinh = models.CharField(db_column='MaTinh', max_length=12, blank=True, null=True)  # Field name made lowercase.
    loai = models.CharField(db_column='Loai', max_length=20, blank=True, null=True)  # Field name made lowercase.
    tenkhongdau = models.CharField(db_column='TenKhongDau', max_length=20, blank=True, null=True)  # Field name made lowercase.
    shape = models.TextField(db_column='Shape', blank=True, null=True)  # Field name made lowercase. This field type is a guess.

    class Meta:
        managed = False
        db_table = 'QUANHUYEN'
