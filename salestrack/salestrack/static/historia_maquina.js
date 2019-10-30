
function prepareSelect2() {
    $.ajax({
        url: '/maquinas/search_maquinas//',
        dataType: 'json',
        success: data => {
            var dataForSelect = [];

            $.map (data, item => {
                dataForSelect.push({id: item.fields.key, text: item.fields.descripcion})
            });
            $('#id_maquina').select2({
                data: dataForSelect,
                minimumResultsForSearch: 10
            });
        }
    });
}

window.onload = prepareSelect2;
