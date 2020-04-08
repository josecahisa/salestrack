from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.core import serializers

from clients.models import Client


@login_required
def client_addresses_by_id(request, client_id):
    client = Client.objects.get(id=client_id)
    return HttpResponse(
        serializers.serialize(
            'json',
            client.address_set.all()
        )
    )