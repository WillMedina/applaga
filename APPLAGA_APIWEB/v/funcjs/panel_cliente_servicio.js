async function cliente_llenar_locales() {
    try {
        let select = document.getElementById('cboLocales');
        let opciondefault = '<option value="0">Seleccionar local...</option>';
        select.innerHTML = opciondefault;
        let datos = await fetch(http + '/cliente/api_listarlocales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        let resultado = await datos.json();
        for (var i = 0; i < resultado.datos.length; i++) {
            var option = document.createElement('option');
            option.value = resultado.datos[i].LOCAL_ID;
            var alias = (((resultado.datos[i].NOMBRECLAVE === 'null') || (resultado.datos[i].NOMBRECLAVE === null)) ? '' : '[' + resultado.datos[i].NOMBRECLAVE + '] ');
            option.textContent = alias + resultado.datos[i].DIRECCION;
            select.appendChild(option);
        }
    } catch (e) {
        console.log('panel_cliente_servicio', e);
    }
}

async function cliente_listar_visitas(button) {
    button.disabled = true;
    let div_resultados = document.getElementById('div_resultados');
    let local = document.getElementById('cboLocales');
    let inicio = document.getElementById('fecha1');
    let fin = document.getElementById('fecha2');

    local.classList.remove('input-alerta');
    inicio.classList.remove('input-alerta');
    fin.classList.remove('input-alerta');

    if (local.value === "0" || local.value.length === 0) {
        local.classList.add('input-alerta');
        button.disabled = false;
        return;
    }

    if (inicio.value === "" || inicio.value.length === 0) {
        inicio.classList.add('input-alerta');
        button.disabled = false;
        return;
    }

    if (fin.value === "" || fin.value.length === 0) {
        fin.classList.add('input-alerta');
        button.disabled = false;
        return;
    }


    if (inicio.value > fin.value) {
        inicio.classList.add('input-alerta');
        fin.classList.add('input-alerta');
        button.disabled = false;
        return;
    }

    try {
        let entrada = {local_id: local.value, inicio: inicio.value, fin: fin.value};
        let datos = await fetch(http + '/servicio/api_cliente_listar_servicios',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entrada)
                });
        let resultado = await datos.json();

        let resultado_final = '<form onsubmit="return false;">';
        resultado_final += '<table class="responsive tabla-blanca">';

        resultado_final += '<thead>';
        resultado_final += '<tr>';
        resultado_final += '<th class="td_center" style="width: 20%">LOCAL</th>';
        resultado_final += '<th class="td_center solo-desktop" style="width: 20%">N° CONSTANCIA</th>';
        resultado_final += '<th class="td_center" style="width: 20%">INICIO</th>';
        resultado_final += '<th class="td_center solo-desktop" style="width: 20%">FIN</th>';
        resultado_final += '<th class="td_center" style="width: 20%">ACCIONES</th>';
        resultado_final += '</tr>';
        resultado_final += '</thead>';
        resultado_final += '<tbody>';

        for (var i = 0; i < resultado.datos.length; i++) {
            resultado_final += '<tr id="' + resultado.datos[i].VISITA_ID + '">';
            resultado_final += '<td class="td_center">' + resultado.datos[i].DIRECCION + '</td>';
            resultado_final += '<td class="td_center solo-desktop">' + resultado.datos[i].N_CONSTANCIA + '</td>';
            resultado_final += '<td class="td_center">' + mysql_to_dtl(resultado.datos[i].INICIO) + '</td>';
            resultado_final += '<td class="td_center solo-desktop">' + mysql_to_dtl(resultado.datos[i].FIN) + '</td>';
            resultado_final += '<td class="td_center">';
            resultado_final += '<button onclick="ver_visita(\'' + resultado.datos[i].CODIGO_UNICO + '\')"><i class="fas fa-file-alt"></i> INFORMACI&Oacute;N</button>';
            resultado_final += '</td>';
            resultado_final += '</tr>';
        }

        if (resultado.datos.length === 0) {
            resultado_final += '<tr>';
            resultado_final += '<td colspan="6" style="padding: 3px" class="td_center">';
            resultado_final += '<i class="fas fa-exclamation-triangle"></i> No se han encontrado servicios en ese local o rangos de fecha.';
            resultado_final += '</td>';
            resultado_final += '</tr>';

        }

        resultado_final += '</tbody>';
        resultado_final += '</table>';
        resultado_final += '</form>';

        div_resultados.innerHTML = resultado_final;
    } catch (e) {
        console.log('panel_cliente_servicio', e);
    }

    button.disabled = false;
}

function ver_visita(codigo_unico) {
    to(http + '/panel/mis_servicios/' + codigo_unico);
}

async function listarArchivos(id, button_element) {
    //api_listar_archivos
    try {
        let modal = document.getElementById('modal_listar_archivos');
        let button = button_element;
        button.disabled = true;
        let resultados = await obtener_listaarchivos_raw(id);

        let salida_final = '';
        document.getElementById("listado_archivos_tabla").innerHTML = salida_final;

        if (resultados.datos[0].resultado == 0) {
            salida_final += '<tr>';
            salida_final += '<td colspan="3" class="td_center"><i class="fas fa-exclamation-triangle"></i> ' + resultados.datos[0].mensaje + '</td>';
            salida_final += '</tr>';
        } else {
            for (var i = 0; i < resultados.datos.length; i++) {
                salida_final += '<tr>';
                salida_final += '<td class="td_center">' + resultados.datos[i].NOMBRE + '</td>';
                salida_final += '<td class="td_center">' + extension_icon(resultados.datos[i].EXTENSION) + '</td>';
                salida_final += '<td class="td_center"><button><i class="fas fa-download"></i> Descargar</button></td>';
                salida_final += '</tr>';
            }
        }

        document.getElementById("listado_archivos_tabla").innerHTML = salida_final;

        button.disabled = false;
        invocar_modal(modal);
    } catch (e) {
        console.log(e);
    }
}

async function obtener_listaarchivos_raw(servicio_id) {
    try {
        let entrada = {visita_id: servicio_id};
        let datos = await fetch(http + '/servicio/api_cliente_listararchivos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultados = await datos.json();
        return resultados;
    } catch (e) {
        console.log(e);
        return null;
    }
}