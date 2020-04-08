from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    # import options
    url(r'^import_products$', views.import_products, name='import_products'),
]
