import { getClientAddresses, filterClientAddresses } from "../utils.js";

const onClientChange = (idClient, onLoad) => {
    // getClientAddresses(idMaquina, '#id_lugar');
    const address_select = django.jQuery( "#id_delivery_address" );
    if (onLoad) {
        if (address_select.length === 1) {
            filterClientAddresses(idClient, address_select);
        }
    } else {
        filterClientAddresses(idClient, address_select);
    }
};


django.jQuery(document).ready(() => {
    django.jQuery("#id_client").change(function(event){
        if (event.target.value) {
            const idClient = event.target.value;
            onClientChange(idClient, false)
            // const idClient = event.target.value;
            // getClientAddresses(idClient, '#id_delivery_address');
        }
    });

    const idClient = django.jQuery("#id_client").val();
    if (idClient != null && idClient.trim() != '') {
        onClientChange(idClient, true);
    }

});
