import graphene

import budgets.schema
import clients.schema

class Query(budgets.schema.Query, clients.schema.Query, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)
