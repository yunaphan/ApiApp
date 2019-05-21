# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django import forms
from django.forms import ModelForm


class Tencx(models.Model):
    matencx = models.CharField(db_column='MaTenCX', max_length=10, primary_key=True)
    tencx = models.CharField(db_column='TenCX', max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'TenCX'
    def __str__(self):
        return self.matencx, self.tencx

class ThemTenCX(forms.ModelForm):
    class Meta:
        model = Tencx
        fields = '__all__'
