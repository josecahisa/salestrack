import { GraphQLApi } from 'components/Api/GraphQLApi';
import { Logger } from 'components/Utils/Logger';

const logger = new Logger('ClientApi');

class BudgetApi extends GraphQLApi {
    getShippings = () => {
        return this.getQueryResultForQueryNameAndFields('allShippings','id, name');
    }

    getPaymentTerms = () => {
        return this.getQueryResultForQueryNameAndFields('allPaymentsterms','id, name');
    }

    getBudgetById = budgetId => {
        // TODO: Move common queries to constants
        const budgetQuery = `query{
            budget(id:${budgetId}) {
                id,
                number,
                date,
                status,
                client { id, name },
                deliveryAddress { id, address },
                paymentTerm { id, name },
                discount,
                shipping { id, name },
                deliveryCity { id, name },
                budgetdetailSet {
                    id,
                    quantity,
                    price,
                    product { id, description, getPhoto }
                }
            }
        }`;

        return this.getQueryRequest(budgetQuery)
            .then( response => {
              return response.body.data.budget;
            });
    }

    updateBudget = (budget) => {
        // TODO: refator this function
        let fieldsToUpdate = '';
        Object.entries(budget).map(([key, value]) => {
            const separator = fieldsToUpdate ? ', ' : '';
            const valueDelimiter = (key === 'date' || key === 'status') ? '"' : '';
            fieldsToUpdate = fieldsToUpdate + separator + key + ':' + valueDelimiter + value + valueDelimiter;
        });
        console.log(fieldsToUpdate);
        const budgetMutation = `mutation {
            updateBudget(${fieldsToUpdate}) {
                budget { id, date, number }
            }
        }`

        return this.getQueryRequest(budgetMutation)
                    .then( response => {
                        logger.log(JSON.stringify(response.body.data.updateBudget), 'updateBudget');
                        return response.body.data.updateBudget.budget;
                    });
    }

    addBudgetDetail = (budgetDetail) => {
        const fieldsToUpdate = this.createMutationFieldsFromObject(budgetDetail);

        const budgetMutation = `mutation {
            updateBudgetDetail(${fieldsToUpdate}) {
                budgetDetail { id, price, product { id, description } }
            }
        }`

        return this.getQueryRequest(budgetMutation)
                    .then( response => {
                        return response.body.data.updateBudgetDetail.budgetDetail;
                    });
    }

}

export const budgetApi = new BudgetApi();
