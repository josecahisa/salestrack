from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.core import serializers
from django.db import models
from django.contrib.auth.decorators import login_required


@login_required
def budget_form(request):
    return render_to_response('budget/budget_form.html')
