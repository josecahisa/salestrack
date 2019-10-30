
export const addSelectOption = (targetSelect, value, description) => {
    const newOption = new Option(description, value);
    django.jQuery(newOption).html(description);
    targetSelect.append(newOption)
};

export const filtrarTareasMantenimiento = (idMaquina, select_mantenimientos) => {

    django.jQuery.ajax({
        url: "/maquinas/json/mantenimientos_by_maquinaid/" + idMaquina + "/",
        success: function(result) {
            select_mantenimientos.empty();
            const mantenimientos_by_maquinaid = django.jQuery.parseJSON(result);

            if (result) {
                addSelectOption(select_mantenimientos, "", "----------");
                mantenimientos_by_maquinaid.forEach( mantenimiento => {
                    addSelectOption(select_mantenimientos, mantenimiento.fields.key, mantenimiento.fields.nombre);
                });
            } else {
                addSelectOption(select_mantenimientos, "0", "No hay tareas de mantenimiento definidas para la máquina");
            }
        }
     });
};

export const getMaquinaById = (idMaquina, elementIdLugar, elementIdProyecto) => {

    const idLugar = django.jQuery(elementIdLugar).val();
    const idProyecto = django.jQuery(elementIdProyecto).val();

    if (idLugar != null && idLugar.trim() != '' && idProyecto != null && idProyecto.trim() != '') {
        // Los campos ya tienen valor, no hacer la llamada ajax
        return;
    }

    django.jQuery.ajax({
        url: "/maquinas/json/maquina_by_id/" + idMaquina + "/",
        success: function(result) {
            if (result) {
                const responseMaquina = django.jQuery.parseJSON(result);

                if (idLugar === null || idLugar.trim() === '') {
                    const ultimaUbicacion = responseMaquina[0].fields.ultima_ubicacion;
                    if (ultimaUbicacion) {
                        django.jQuery(elementIdLugar).val(ultimaUbicacion);
                    }
                }
                
                if (idProyecto === null || idProyecto.trim() === '') {
                    const ultimoProyecto = responseMaquina[0].fields.ultimo_proyecto;
                    if (ultimoProyecto) {
                        django.jQuery(elementIdProyecto).val(ultimoProyecto);
                    }
                }
            } 
        }
     });

};