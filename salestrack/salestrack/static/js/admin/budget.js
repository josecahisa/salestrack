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

function getCookie(name) {
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
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function retrieveAllProductsAndSetupProductSelect() {


    const query = `{
        allProducts {
            id,
            providerAlphaCode,
            providerCode,
            description
        }
    }`;

    const queryObj = {
        "query": query
    };

    $.ajax({
        url: '/graphql',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(queryObj), 
        success: data => {
            var dataForSelect = [];

            $.map (data.data.allProducts, item => {
                dataForSelect.push({id: item.id, text: item.description})
            });

            $("[id^='id_budgetdetail_set']").select2({
                data: dataForSelect,
                minimumResultsForSearch: 10
            });

        }
    });
}

django.jQuery(document).ready(() => {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    
    django.jQuery("#id_client").change(function(event){
        if (event.target.value) {
            const idClient = event.target.value;
            onClientChange(idClient, false)
        }
    });

    const idClient = django.jQuery("#id_client").val();
    if (idClient != null && idClient.trim() != '') {
        onClientChange(idClient, true);
    }

    console.log('setting click handler');
    setTimeout(() => {
        const addBudgetDetailButton = django.jQuery("a[data-ol-has-click-handler]:contains('Agregar otro/a Detalle de Presupuesto')");
        if (addBudgetDetailButton.length != 1) {
            console.error('El boton de agregar detalle no fue reconocido correctamente');
        }
        addBudgetDetailButton.click((event) => {
            setTimeout(() => {
                retrieveAllProductsAndSetupProductSelect();
            },0);
        });
    }, 0);

});
