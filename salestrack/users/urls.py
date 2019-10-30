from django.conf.urls import url
from django.contrib.auth.views import LoginView, LogoutView

from .views import home
# from .views import new_invitation, accept_invitation

urlpatterns = [
    url(r'home$', home, name="user_home"),
    url(r'login$',
        LoginView.as_view(template_name="users/login_form.html"),
        name="user_login"),
    url(r'logout$',
        LogoutView.as_view(),
        name="user_logout"),
]