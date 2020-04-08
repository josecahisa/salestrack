"""salestrack URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import TemplateView
from .views import welcome
from django.conf.urls.static import static # new
from django.conf.urls import url
from django.conf import settings # new
from graphene_django.views import GraphQLView
from salestrack.schema import schema

urlpatterns = [
    path('users/', include('users.urls')),
    path('products/', include('products.urls')),
    path('clients/', include('clients.urls')),
    path('budgets/', include('budgets.urls')),
    path('admin/', admin.site.urls),    
    path('', welcome, name='welcome'),
    url(r'^graphql$', GraphQLView.as_view(graphiql=True, schema=schema)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)