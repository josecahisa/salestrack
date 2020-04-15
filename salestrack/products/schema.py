import graphene

from graphene_django.types import DjangoObjectType
from products.models import Business_Unit, Brand, Classification, Category, Product

class Business_UnitType(DjangoObjectType):
    class Meta:
        model = Business_Unit

class BrandType(DjangoObjectType):
    class Meta:
        model = Brand

class ClassificationType(DjangoObjectType):
    class Meta:
        model = Classification

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

class ProductType(DjangoObjectType):
    class Meta:
        model = Product

class Query(object):
    all_products = graphene.List(ProductType)
    all_products_not_accesory = graphene.List(ProductType)
    all_accesories = graphene.List(ProductType)
    product = graphene.Field(ProductType, id=graphene.Int())

    def resolve_all_products(self, info, **kwargs):
        return Product.objects.all()

    def resolve_all_products_not_accesory(self, info, **kwargs):
        return Product.objects.filter(is_accesory=False)

    def resolve_all_accesories(self, info, **kwargs):
        return Product.objects.filter(is_accesory=True)

    def resolve_product(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Product.objects.get(pk=id)

        return None


