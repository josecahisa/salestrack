import superagent from 'superagent';
import { Logger } from 'components/Utils/Logger';

const logger = new Logger('GraphQLApi');

const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export class GraphQLApi {
    constructor() {
        this.queryObj = {
            "query": ""
        };
    }

    getBaseRequest = () => {
        var csrftoken = getCookie('csrftoken');
        return superagent
            .post('/graphql')
            .accept('application/json')
            .set('X-CSRFToken', csrftoken);

    }

    getQueryRequest = (query) => {
        this.queryObj.query = query;
        return this.getBaseRequest()
            .send(this.queryObj);
    }

    getQueryResultForQueryNameAndFields = (queryName, fields) => {
        const query = `{
            ${queryName} {
                ${fields}
            }
        }`;
        logger.log(query, 'getQueryResultForQueryNameAndFields');
        return this.getQueryRequest(query)
            .then(response => {
                logger.log(response, 'getQueryResultForQueryNameAndFields');
                return response.body.data[queryName];
            });
    }

    getValueDelimiter = value => {
        if (value instanceof Date ||
            typeof(value) === 'string') {
            return '"';
        }
        if (typeof(value) === 'number' && !Number.isInteger(value)) {
            return '"';
        }
        return '';
    }

    createMutationFieldsFromObject = objectArg => {
        let fieldsToUpdate = '';

        Object.entries(objectArg).map(([key, value]) => {
            const separator = fieldsToUpdate ? ', ' : '';
            const valueDelimiter = this.getValueDelimiter(value);
            fieldsToUpdate = fieldsToUpdate + separator + key + ':' + valueDelimiter + value + valueDelimiter;
        });

        console.log(fieldsToUpdate);
        return fieldsToUpdate;
    }

}

export const graphQLApi = new GraphQLApi();
