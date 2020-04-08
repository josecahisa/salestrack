from django.urls import path
from django.conf.urls import url

from clients import views

urlpatterns = [
    # import options
    url(r'^json/client_addresses_by_id/(?P<client_id>\d*)/$', views.client_addresses_by_id, name='client_addresses_by_id'),
]
