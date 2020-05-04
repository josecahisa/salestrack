import { GraphQLApi } from 'components/Api/GraphQLApi';
import { Logger } from 'components/Utils/Logger';

const logger = new Logger('ClientApi');

class ClientApi extends GraphQLApi {
    getClients = () => {
        const clientsQuery = `{ allClients { id, name } }`;

        return this.getQueryRequest(clientsQuery)
                    .then(response => response.body.data.allClients);
    }

    createClient = name => {
        return this.updateClient(name);
    }

    updateClient = name => {
        const addClientMutationTemplate = `mutation {
            updateClient(id:0, name:"${name}") {
                client { id, name }
            }
        }`
        
        return this.getQueryRequest(addClientMutationTemplate)
                    .then( response => response.body.data.updateClient.client);
    }

    createAddress = (clientId, addressAndDescription) => {
        return this.updateAddress(clientId, addressAndDescription)
            .then( response => {
                logger.log(`${response}`, 'createAddress');
                return response;
            });
    }

    updateAddress = (clientId, addressAndDescription) => {
        const addAddressMutation = `mutation {
            updateAddress(address:"${addressAndDescription}",clientId:${clientId}) {
                address { id, address, description }
            }
        }`

        return this.getQueryRequest(addAddressMutation)
                    .then( response => {
                        logger.log(JSON.stringify(response.body.data.updateAddress), 'updateAddress');
                        return response.body.data.updateAddress.address;
                    });
    }

    getClientAddressSet = clientId => {
        const clientAddressQuery = `{
            client (id: ${clientId}) {
                addressSet { id, description, address }
            } 
        }`

        return this.getQueryRequest(clientAddressQuery)
            .then ( response => {
                logger.log(response, 'getQueryRequest');
                return response.body.data.client.addressSet;
            })
    }

    getCities = () => {
        return this.getQueryResultForQueryNameAndFields('allCities','id, name');
    }
}

export const clientApi = new ClientApi();
