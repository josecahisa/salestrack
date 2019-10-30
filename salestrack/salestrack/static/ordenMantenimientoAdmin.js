import { filtrarTareasMantenimiento, getMaquinaById } from "./utils.js";

const onMaquinaChange = (idMaquina, onLoad) => {
    getMaquinaById(idMaquina, '#id_lugar', '#id_proyecto');
    const select_mantenimientos = django.jQuery( "select[id^='id_omdetalle_set']" );
    if (onLoad) {
        if (select_mantenimientos.length === 1) {
            filtrarTareasMantenimiento(idMaquina, select_mantenimientos);
        }
    } else {
        filtrarTareasMantenimiento(idMaquina, select_mantenimientos);
    }
};

const setupInputMasks = () => {
    const numeroElement = django.jQuery('#id_numero')
    var im = new Inputmask("OM-99999");
    im.mask(numeroElement);

    const fechaElement = django.jQuery('#id_fecha')
    var im2 = new Inputmask("datetime", {
        inputFormat: "dd/mm/yyyy",
        outputFormat: "dd/mm/yyyy",
        inputEventOnly: true
    });
    im2.mask(fechaElement);
};

django.jQuery(document).ready(() => {
    django.jQuery("#id_maquina").change(function(event){
        if (event.target.value) {
            onMaquinaChange(event.target.value, false);
        }
    });

    setupInputMasks();

    const idMaquina = django.jQuery("#id_maquina").val();
    if (idMaquina != null && idMaquina.trim() != '') {
        onMaquinaChange(idMaquina, true);
    }
})
