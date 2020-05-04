"""
GraphQL Main schema setup
"""
import graphene

import budgets.schema
import clients.schema
import products.schema

class Query(budgets.schema.Query,
            clients.schema.Query,
            products.schema.Query,
            graphene.ObjectType):
    pass

class Mutation(clients.schema.Mutation,
               budgets.schema.Mutation,
               graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
