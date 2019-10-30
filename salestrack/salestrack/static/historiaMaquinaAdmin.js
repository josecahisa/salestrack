//**put this file in your media dir (ex: project_foo/media/js/product.js):**


var addSelectOption = (targetSelect, value, description) => {
    const newOption = new Option(description, value);
    $(newOption).html(description);
    targetSelect.append(newOption)
};

var update_mantenimiento = function() {
    const maquina_elegida_id = document.getElementById("id_maquina").value;
    var select_mantenimientos = $("#id_mantenimiento");

    $.ajax({
        url: "/maquinas/mantenimientos_by_maquinaid/" + maquina_elegida_id + "/",
        success: function(result) {
            select_mantenimientos.empty();

            const mantenimientos_by_maquinaid = $.parseJSON(result);

            if (result) {
                addSelectOption(select_mantenimientos, "", "----------");
                mantenimientos_by_maquinaid.forEach( mantenimiento => {
                    addSelectOption(select_mantenimientos, mantenimiento.pk, mantenimiento.fields.descripcion);
                });
            } else {
                addSelectOption(select_mantenimientos, "0", "No hay mantenimientos para el modelo");
            }
        }
     });
};

window.onload = function() {
    update_mantenimiento();

    $("#id_maquina").on("change", function(){
        update_mantenimiento();
    });
};

