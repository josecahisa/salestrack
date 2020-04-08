import graphene

from graphene_django.types import DjangoObjectType
from budgets.models import Budget, Shipping, PaymentTerm, BudgetDetail

class BudgetType(DjangoObjectType):
    class Meta:
        model = Budget

class ShippingType(DjangoObjectType):
    class Meta:
        model = Shipping

class PaymentTermType(DjangoObjectType):
    class Meta:
        model = PaymentTerm

class BudgetDetailType(DjangoObjectType):
    class Meta:
        model = BudgetDetail

class Query(object):
    all_budgets = graphene.List(BudgetType)
    budget = graphene.Field(BudgetType, id=graphene.Int())

    all_shippings = graphene.List(ShippingType)
    shipping = graphene.Field(ShippingType, id=graphene.Int())

    all_paymentsTerms = graphene.List(PaymentTermType)
    paymentTerm = graphene.Field(PaymentTermType, id=graphene.Int())

    all_budgetDetails = graphene.List(BudgetDetailType)

    def resolve_all_budgets(self, info, **kwargs):
        return Budget.objects.all()
    
    def resolve_budget(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Budget.objects.get(pk=id)

        return None

    def resolve_all_shippings(self, info, **kwargs):
        return Shipping.objects.all()

    def resolve_all_shipping(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Shipping.objects.get(pk=id)

        return None

    def resolve_all_paymentsTerms(self, info, **kwargs):
        return PaymentTerm.objects.all()

    def resolve_paymentTerm(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return PaymentTerm.objects.get(pk=id)

        return None

    def resolve_all_budgetDetails(self, info, **kwargs):
        return Budget.objects.select_related('budgetDetail').all()
