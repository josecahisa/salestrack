

function prepareSelect2() {
    $.ajax({
        url: '/maquinas/search_proyectos//',
        dataType: 'json',
        success: data => {
            var dataForSelect = [];

            $.map (data, item => {
                dataForSelect.push({id: item.pk, text: item.fields.nombre})
            });
            $('#id_proyecto').select2({
                data: dataForSelect,
                minimumResultsForSearch: 10
            });
        }
    });
}

window.onload = prepareSelect2;
