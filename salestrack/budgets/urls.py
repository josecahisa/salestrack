from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('budget_form', views.budget_form, name='budget_form'),
]