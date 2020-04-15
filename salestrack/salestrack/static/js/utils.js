
export const addSelectOption = (targetSelect, value, description) => {
    const newOption = new Option(description, value);
    django.jQuery(newOption).html(description);
    targetSelect.append(newOption)
};

export const filterClientAddresses = (idClient, address_select) => {

    django.jQuery.ajax({
        url: "/clients/json/client_addresses_by_id/" + idClient + "/",
        success: function(result) {
            address_select.empty();
            const addressesResponse = django.jQuery.parseJSON(result);

            if (result) {
                addSelectOption(address_select, "", "----------");
                addressesResponse.forEach( address => {
                    addSelectOption(address_select, address.fields.key, address.fields.address);
                });
            } else {
                addSelectOption(address_select, "0", "No se encontró una dirección para el cliente");
            }
        }
     });
};

export const getClientAddresses = (idClient, addressElement) => {

    console.log('idclient = ' + idClient);

     django.jQuery.ajax({
        url: "/clients/json/client_addresses_by_id/" + idClient + "/",
        success: function(result) {
            addressElement.empty();
            const addressesResponse = django.jQuery.parseJSON(result);

            if (result) {
                addSelectOption(addressElement, "", "----------");
                addressesResponse.forEach( address => {
                    addSelectOption(addressElement, addressesResponse.fields.key, addressesResponse.fields.address);
                });
            } else {
                addSelectOption(addressElement, "0", "No se encontró una dirección para el cliente");
            }
        }
     });


};