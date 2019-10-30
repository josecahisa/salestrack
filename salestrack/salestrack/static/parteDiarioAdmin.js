
import { getMaquinaById } from "./utils.js";

window.onload = function() {
    django.jQuery("#id_maquina").change(function(event){
        if (event.target.value) {
            const idMaquina = event.target.value;
            const select_mantenimientos = django.jQuery( "select[id^='id_omdetalle_set']" );
            getMaquinaById(idMaquina, '#id_lugar', '#id_proyecto');
        }
    });
};

// lugarElement = document.getElementById('id_lugar');
// proyectoElement = document.getElementById('id_proyecto');

// const getProyectoById = idProyecto => {
    
//     $.ajax({
//         url: "/maquinas/proyecto_by_id/" + idProyecto + "/",
//         success: function(result) {
//             if (result) {
//                 const responseProyecto = $.parseJSON(result);
//                 proyectoElement.value = responseProyecto[0].pk;
//             } 
//         }
//      });

// };


// const getLugarById = idLugar => {
    
//     $.ajax({
//         url: "/maquinas/lugar_by_id/" + idLugar + "/",
//         success: function(result) {
//             if (result) {
//                 const responseLugar = $.parseJSON(result);
//                 lugarElement.value = responseLugar[0].pk;
//             } 
//         }
//      });

// };

// const getMaquinaById = idMaquina => {

//     $.ajax({
//         url: "/maquinas/maquina_by_id/" + idMaquina + "/",
//         success: function(result) {
//             if (result) {
//                 const responseMaquina = $.parseJSON(result);

//                 const ultimaUbicacion = responseMaquina[0].fields.ultima_ubicacion;
//                 if (ultimaUbicacion) {
//                     lugarElement.value = ultimaUbicacion;
//                 }
                
//                 const ultimoProyecto = responseMaquina[0].fields.ultimo_proyecto;
//                 if (ultimoProyecto) {
//                     proyectoElement.value = ultimoProyecto;
//                 }
//             } 
//         }
//      });

// };

// $(document).ready(function(){
    
//     maquinaElement = document.getElementById('id_maquina');
//     maquinaElement.onchange = function(event){ 
//         if (event.target.value) {
//             const idMaquina = event.target.value;
//             getMaquinaById(idMaquina);
//         }
//     };

// });