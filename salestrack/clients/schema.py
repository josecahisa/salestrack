"""
This module define GraphQL schemas for Clients module database access
"""
import graphene

from graphene_django.types import DjangoObjectType
from clients.models import Client, City, Country, Region, Address, Telephone

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

class PhoneType(DjangoObjectType):
    class Meta:
        model = Telephone

class ClientMutation(graphene.Mutation):
    class Arguments:
        # Input arguments for this mutation
        name = graphene.String(required=True)
        id = graphene.ID()
        nit = graphene.String(required=False)

    client = graphene.Field(ClientType)

    def mutate(self, info, name, id, nit):
        try:
            client = Client.objects.get(pk=id)
            client.name = name
        except:
            client = Client(
                name=name
            )

        if nit is not None:
            client.nit = nit

        client.save()
        return ClientMutation(client=client)

class AddressMutation(graphene.Mutation):
    class Arguments:
        address = graphene.String(required=True)
        clientId = graphene.ID(required=True)


    address = graphene.Field(AddressType)

    def mutate(self, info, clientId, address):
        try:
            client = Client.objects.get(pk=clientId)
        except:
            return

        description=""
        address = Address(address=address, description=description, client=client)
        address.save()
        return AddressMutation(address=address)

class PhoneMutation(graphene.Mutation):
    class Arguments:
        number = graphene.String(required=True)
        clientId = graphene.ID(required=True)


    phone = graphene.Field(PhoneType)

    def mutate(self, info, clientId, address):
        try:
            client = Client.objects.get(pk=clientId)
        except:
            return

        description=""
        phone = Telephone(number=address, description=description, client=client)
        phone.save()
        return PhoneMutation(phone=phone)

class Mutation(graphene.ObjectType):
    update_client = ClientMutation.Field()
    update_address = AddressMutation.Field()
    update_phone = PhoneMutation.Field()

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

    all_phones = graphene.List(PhoneType)

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

    def resolve_all_phones(self, info, **kwargs):
        return Client.objects.select_related('telephone').all()
