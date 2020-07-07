import { GraphQLApi } from 'components/Api/GraphQLApi';
import { Logger } from 'components/Utils/Logger';

const logger = new Logger('ClientApi');

class ClientApi extends GraphQLApi {
    getClients = () => {
        const clientsQuery = `{ allClients { id, name, nit } }`;

        return this.getQueryRequest(clientsQuery)
                    .then(response => response.body.data.allClients);
    }

    createClient = (name, nit) => {
        return this.updateClient(0, name, nit);
    }

    updateClient = (id, name, nit) => {
        const addClientMutationTemplate = `mutation {
            updateClient(id:${id}, name:"${name}", nit:"${nit}") {
                client { id, name, nit }
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
                return response.body.data.client.addressSet;
            })
    }

    getClientPhoneSet = clientId => {
        const clientAddressQuery = `{
            client (id: ${clientId}) {
                telephoneSet { id, description, number }
            } 
        }`

        return this.getQueryRequest(clientAddressQuery)
            .then ( response => {
                return response.body.data.client.telephoneSet;
            })
    }

    createPhone = (clientId, number) => {
        return this.updatePhone(clientId, number)
            .then( response => {
                logger.log(`${response}`, 'createPhone');
                return response;
            });
    }

    updatePhone = (clientId, number) => {
        const phoneMutation = `mutation {
            updatePhone(number:"${number}",clientId:${clientId}) {
                phone { id, description, number }
            }
        }`

        return this.getQueryRequest(phoneMutation)
            .then( response => {
                logger.log(JSON.stringify(response.body.data.updateAddress), 'updateAddress');
                return response.body.data.updateAddress.address;
            });
    }


    getCities = () => {
        return this.getQueryResultForQueryNameAndFields('allCities','id, name');
    }
}

export const clientApi = new ClientApi();
