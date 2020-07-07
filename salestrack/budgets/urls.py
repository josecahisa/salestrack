from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('budget_form', views.budget_form, name='budget_form'),
    # path('generate_pdf', views.generate_pdf, name='generate_pdf'),
    url(r'^generate_pdf/(?P<budget_id>\w*)/$', views.generate_pdf, name='generate_pdf'),
]