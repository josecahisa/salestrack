"""
This module define GraphQL schemas for Budgets module database access
"""
import graphene

from graphene_django.types import DjangoObjectType
from budgets.models import Budget, Shipping, PaymentTerm, BudgetDetail
from products.models import Product

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


# ----
# Mutations - This section specifies all the mutations allowed through GraphQL inteface

class BudgetMutation(graphene.Mutation):
    class Arguments:
        # Input arguments for this mutation
        date = graphene.Date(required=False)
        client_id = graphene.ID(required=False)
        delivery_address_id = graphene.ID(required=False)
        payment_term_id = graphene.ID(required=False)
        shipping_id = graphene.ID(required=False)
        status = graphene.String(required=False)
        delivery_city_id = graphene.ID(required=False)
        discount = graphene.Decimal(required=False)
        id = graphene.ID(required=False)
        commercial_terms = graphene.String(required=False)

    budget = graphene.Field(BudgetType)

    def mutate(
            self,
            info,
            id=0,
            date=None,
            client_id=None,
            delivery_address_id=None,
            payment_term_id=None,
            shipping_id=None,
            status=None,
            delivery_city_id=None,
            discount=None,
            commercial_terms=None
        ):

        try:
            budget = Budget.objects.get(pk=id)
        except:
            budget = Budget()

        if date is not None:
            budget.date = date

        if client_id is not None:
            budget.set_client(client_id)

        if delivery_address_id is not None:
            budget.set_delivery_address(delivery_address_id)

        if payment_term_id is not None:
            budget.payment_term_id = payment_term_id

        if shipping_id is not None:
            budget.shipping_id = shipping_id

        if status is not None:
            budget.status = status

        if delivery_city_id is not None:
            budget.delivery_city_id = delivery_city_id

        if discount is not None:
            budget.discount = discount

        if commercial_terms is not None:
            budget.commercial_terms = commercial_terms

        budget.save()
        return BudgetMutation(budget=budget)


class BudgetDetailMutation(graphene.Mutation):
    budget_detail = graphene.Field(BudgetDetailType)

    class Arguments:
        # Input arguments for this mutation
        id = graphene.ID(required=True)
        budget_id = graphene.ID(required=False)
        product_id = graphene.ID(required=False)
        quantity = graphene.Int()
        price = graphene.Decimal(required=False)

    def mutate(
            self,
            info,
            id,
            budget_id=None,
            product_id=None,
            quantity=None,
            price=None
        ):

        already_exists = False
        try:
            budget_detail = BudgetDetail.objects.get(pk=id)
            already_exists = True
        except:
            budget_detail = BudgetDetail()

        if already_exists:
            if quantity:
                budget_detail.quantity = quantity
            
            if price:
                budget_detail.price = price
        else:
            budget = Budget.objects.get(pk=budget_id)
            product = Product.objects.get(pk=product_id)
            budget_detail.budget = budget
            budget_detail.product = product
            budget_detail.quantity = quantity
            budget_detail.price = product.wholesale_price

        budget_detail.save()
        return BudgetDetailMutation(budget_detail=budget_detail)

class BudgetDetailDelete(graphene.Mutation):
    result = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        budget_detail = BudgetDetail.objects.get(pk=id)
        budget_detail.delete()
        return BudgetDetailDelete(result=True)


class Mutation(graphene.ObjectType):
    update_budget = BudgetMutation.Field()
    update_budget_detail = BudgetDetailMutation.Field()
    delete_budget_detail = BudgetDetailDelete.Field()
