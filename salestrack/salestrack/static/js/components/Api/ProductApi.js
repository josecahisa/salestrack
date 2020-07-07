import { GraphQLApi } from 'components/Api/GraphQLApi';

class ProductApi extends GraphQLApi {

    getMainProducts = () => {
        const requestedData = `
            id, description, getPhoto,
            productType { code, photo }
        `;
        return this
            .getQueryResultForQueryNameAndFields('allProductsNotAccesory', requestedData)
            .then(products => {
                const reformattedProducts = products
                    .map(product => {
                        product.photo = product.getPhoto;    
                        product.code = product.productType.code;
                        return product;
                    });
                return reformattedProducts;
            });
    }
}

export const productApi = new ProductApi();


