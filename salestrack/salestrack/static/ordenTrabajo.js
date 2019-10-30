import { getMaquinaById } from "./utils.js";

const setupInputMasks = () => {
    const numeroElement = django.jQuery('#id_numero')
    var im = new Inputmask("OT-99999");
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
            const idMaquina = event.target.value;
            getMaquinaById(idMaquina, '#id_lugar', '#id_proyecto');
        }
    });

    setupInputMasks();
});
