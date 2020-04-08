import graphene

from graphene_django.types import DjangoObjectType
from clients.models import Client, City, Country, Region, Address

class ClientType(DjangoObjectType):
    class Meta:
        model = Client

class CityType(DjangoObjectType):
    class Meta:
        model = City

class CountryType(DjangoObjectType):
    class Meta:
        model = Country

class RegionType(DjangoObjectType):
    class Meta:
        model = Region

class AddressType(DjangoObjectType):
    class Meta:
        model = Address


class Query(object):
    all_cities = graphene.List(CityType)
    city = graphene.Field(CityType, id=graphene.Int(), name=graphene.String())

    all_countries = graphene.List(CountryType)
    country = graphene.Field(CountryType, id=graphene.Int(), name=graphene.String())

    all_regions = graphene.List(RegionType)
    region = graphene.Field(RegionType, id=graphene.Int(), name=graphene.String())

    all_clients = graphene.List(ClientType)
    client = graphene.Field(ClientType, id=graphene.Int(), name=graphene.String())

    all_addresses = graphene.List(AddressType)

    def resolve_all_cities(self, info, **kwargs):
        return City.objects.all()
    
    def resolve_city(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return City.objects.get(pk=id)

        if name is not None:
            return City.objects.get(name=name)

        return None

    def resolve_all_countries(self, info, **kwargs):
        return Country.objects.all()

    def resolve_country(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Country.objects.get(pk=id)

        if name is not None:
            return Country.objects.get(name=name)

        return None

    def resolve_all_regions(self, info, **kwargs):
        return Region.objects.all()

    def resolve_region(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Region.objects.get(pk=id)

        if name is not None:
            return Region.objects.get(name=name)

        return None

    def resolve_all_clients(self, info, **kwargs):
        return Client.objects.all()

    def resolve_client(self, info, **kwargs):
        id = kwargs.get('id')
        name = kwargs.get('name')
        if id is not None:
            return Client.objects.get(pk=id)

        if name is not None:
            return Client.objects.get(name=name)

        return None

    def resolve_all_addresses(self, info, **kwargs):
        return Client.objects.select_related('address').all()

