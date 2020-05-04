"""
This module define GraphQL schemas for Products module database access 
"""

import graphene
from graphene_django.types import DjangoObjectType
from products.models import Business_Unit, \
    Brand, \
    Classification, \
    Category, \
    Product, \
    Product_Type

class BusinessUnitType(DjangoObjectType):
    """ Business_Unit GraphQL Type
    """
    class Meta:
        model = Business_Unit

class BrandType(DjangoObjectType):
    """ BrandType GraphQL Type
    """
    class Meta:
        model = Brand

class ClassificationType(DjangoObjectType):
    """ Classification model GraphQL Type
    """
    class Meta:
        model = Classification

class CategoryType(DjangoObjectType):
    """ Category model GraphQL Type
    """
    class Meta:
        model = Category

class ProductTypeType(DjangoObjectType):
    """ ProductType model GraphQL Type
    """
    class Meta:
        model = Product_Type

class GraphQLProductType(DjangoObjectType):
    """ Product model GraphQL Type
        This is the main model in the Product module
    """
    class Meta:
        model = Product
        # filter_fields = ['is_accesory']
        # interfaces = (relay.Node, )sh
    get_photo = graphene.String()

    def resolve_get_photo(self, info):
        if self is not None:
            return self.get_photo()
        return ''

class Query(object):
    all_products = graphene.List(GraphQLProductType)
    all_products_not_accesory = graphene.List(GraphQLProductType)
    all_accesories = graphene.List(GraphQLProductType)
    product = graphene.Field(GraphQLProductType, id=graphene.Int())

    def resolve_all_products(self, info, **kwargs):
        return Product.objects.all()

    def resolve_all_products_not_accesory(self, info, **kwargs):
        return Product.objects.filter(is_accesory=False)

    def resolve_all_accesories(self, info, **kwargs):
        return Product.objects.filter(is_accesory=True)

    def resolver_all_product_types(self, info, **kwargs):
        return Product_Type.objects.all()

    def resolve_product(self, info, **kwargs):
        lid = kwargs.get('id')
        if lid is not None:
            return Product.objects.get(pk=lid)

        return None
