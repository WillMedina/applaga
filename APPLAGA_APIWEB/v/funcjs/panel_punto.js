async function llenarClientes() {
    try {
        if (document.getElementById('cboClientes')) {
            let select = document.getElementById('cboClientes');
            select.innerHTML = '<option value="0">Seleccionar un cliente...</option>';
            let datos = await fetch(http + '/servicio/api_listarclientes',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
            );

            let resultado = await datos.json();

            for (var i = 0; i < resultado.datos.length; i++) {
                var option = document.createElement('option');
                option.value = resultado.datos[i].CLIENTE_ID;
                option.textContent = '[' + resultado.datos[i].NOMBRECLAVE + '] ' + resultado.datos[i].RAZONSOCIAL;
                select.appendChild(option);
            }
        }
    } catch (e) {
        console.log('panel_servicio', e);
    }
}

async function llenarLocales() {
    try {
        let select = document.getElementById('cboLocal');
        let opciondefault = '<option value="0">Todos los locales...</option>';
        select.innerHTML = opciondefault;

        let cliente_id_valor = document.getElementById('cboClientes').value;
        if (cliente_id_valor == 0) {
            select.innerHTML = opciondefault;
        } else {

            let entrada = {cliente_id: cliente_id_valor};
            let datos = await fetch(http + '/servicio/api_listarlocales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entrada)
            });

            let resultado = await datos.json();

            for (var i = 0; i < resultado.datos.length; i++) {
                var option = document.createElement('option');
                option.value = resultado.datos[i].LOCAL_ID;
                var alias = (((resultado.datos[i].NOMBRECLAVE === 'null') || (resultado.datos[i].NOMBRECLAVE === null)) ? '' : '[' + resultado.datos[i].NOMBRECLAVE + '] ');
                option.textContent = alias + resultado.datos[i].DIRECCION;
                select.appendChild(option);
            }
        }
    } catch (e) {
        console.log('panel_servicio', e);
    }
}

async function buscarMensualPunto(punto_id, month, year) {
    try {
        let entrada = {
            'punto_id': punto_id,
            'month': month,
            'year': year
        }

        let datos = await fetch(http + '/qr/api_listarConsumoMes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        return await datos.json();


    } catch (e) {
        console.log('buscarMensualPunto', e);
        return null;
    }

}

async function buscarTotalesPuntos(button) {
    try {
        button.disabled = true;
        let selectCliente = document.getElementById('cboClientes');
        let selectLocal = document.getElementById('cboLocal');

        let div_resultados = document.getElementById('div_resultados');

        let contenido = '';

        let month = document.getElementById('cboMonth').value;
        let year = document.getElementById('cboYear').value;

        selectCliente.classList.remove('input-alerta');
        selectLocal.classList.remove('input-alerta');

        if (selectCliente.value == "0") {
            selectCliente.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        if (selectLocal.value == "0") {
            selectLocal.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        div_resultados.innerHTML = '<div style="text-align:center">Cargando resultados...</div>';

        let entrada = {'local_id': selectLocal.value, 'month': month, 'year': year};
        let datos = await fetch(http + '/qr/api_listarConsumoMesAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        contenido += '<table class="responsive espaciado tabla-blanca tabla-sombra ultima-fila-resaltada">';
        contenido += '<tr>';
        contenido += '<th style="width: 5%">N&Uacute;MERO</th>';
        contenido += '<th style="width: 20%">UBICACI&Oacute;N</th>';
        contenido += '<th style="width: 5%">PROMEDIO CONSUMIDO</th>';
        contenido += '<th style="width: 5%">RECAMBIOS</th>';
        contenido += '<th style="width: 5%">CONSUMOS</th>';
        contenido += '<th style="width: 5%">SERVICIOS</th>';
        contenido += '<th style="width: 10%">% CONSUMOS</th>';
        contenido += '<th style="width: 10%">% RECAMBIOS</th>';
        contenido += '</tr>';

        if (resultado.datos.length === 0 || resultado.resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="10" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else if (resultado.datos[0].resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="10" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.datos[0].mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                var prom_consumos = (resultado.datos[i].PROM_CONSUMOS == 0 ? resultado.datos[i].PROM_CONSUMOS : '<span class="texto-alerta-fuerte"><b>' + resultado.datos[i].PROM_CONSUMOS + '</b></span>');
                var recambios = (resultado.datos[i].RECAMBIOS == 0 ? resultado.datos[i].RECAMBIOS : '<span class="texto-info-fuerte"><b>' + resultado.datos[i].RECAMBIOS + '</b></span>');
                var consumos = (resultado.datos[i].CONSUMOS == 0 ? resultado.datos[i].CONSUMOS : '<span class="texto-alerta-fuerte"><b>' + resultado.datos[i].CONSUMOS + '</b></span>');
                var prj_consumos = (resultado.datos[i].PRJ_CONSUMOS == '0.0000%' ? resultado.datos[i].PRJ_CONSUMOS : '<span class="texto-alerta-fuerte"><b>' + resultado.datos[i].PRJ_CONSUMOS + '</b></span>');
                var prj_recambio = (resultado.datos[i].PRJ_RECAMBIO == '0.0000%' ? resultado.datos[i].PRJ_RECAMBIO : '<span class="texto-info-fuerte"><b>' + resultado.datos[i].PRJ_RECAMBIO + '</b></span>');

                contenido += '<tr>';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOCONTROL_NUMERO) + '</td>';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOCONTROL_UBICACION) + '</td>';
                contenido += '<td class="td_center">' + prom_consumos + '</td>';
                contenido += '<td class="td_center">' + recambios + '</td>';
                contenido += '<td class="td_center">' + consumos + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].TOTAL_SERVICIOS + '</td>';
                contenido += '<td class="td_center">' + prj_consumos + '</td>';
                contenido += '<td class="td_center">' + prj_recambio + '</td>';
                contenido += '</tr>';
            }
        }

        contenido += '</table>';
        div_resultados.innerHTML = contenido;

        button.disabled = false;

    } catch (e) {
        console.log(e);
        button.disabled = false;
    }

}

async function buscarPuntos(button) {
    try {
        button.disabled = true;
        let selectCliente = document.getElementById('cboClientes');
        let selectLocal = document.getElementById('cboLocal');

        let div_resultados = document.getElementById('div_resultados');
        let contenido = '';

        selectCliente.classList.remove('input-alerta');
        selectLocal.classList.remove('input-alerta');

        if (selectCliente.value == "0") {
            selectCliente.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        if (selectLocal.value == "0") {
            selectLocal.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        let entrada = {local_id: selectLocal.value};
        let datos = await fetch(http + '/qr/api_listarpuntos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        contenido += '<table class="responsive espaciado tabla-blanca tabla-sombra">';
        contenido += '<tr>';
        contenido += '<!-- <th class="solo-desktop" style="width: 10%">ID</th> -->';
        contenido += '<th style="width: 10%">N&Uacute;MERO</th>';
        contenido += '<!-- <th style="width: 29%">NOMBRE</th>-->';
        contenido += '<th style="width: 58%">UBICACI&Oacute;N</th>';
        contenido += '<th class="solo-desktop" style="width: 10%">UNIDAD MEDIDA</th>';
        contenido += '<th style="width: 22%"><i class="fas fa-cogs"></i></th>';
        contenido += '</tr>';

        if (resultado.datos.length === 0 || resultado.resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="6" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else if (resultado.datos[0].resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="6" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.datos[0].mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                contenido += '<tr>';
                contenido += '<!-- <td class="td_center solo-desktop">' + resultado.datos[i].PUNTOCONTROL_ID + '</td> -->';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOCONTROL_NUMERO) + '</td>';
                contenido += '<!-- <td class="td_center">' + posnull(resultado.datos[i].PUNTOCONTROL_NOMBRE) + '</td> -->';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOCONTROL_UBICACION) + '</td>';
                contenido += '<td class="td_center solo-desktop">' + resultado.datos[i].UNIDADMEDIDA + ' (' + resultado.datos[i].UNIDADMEDIDA_SIMBOLO + ')</td>';
                contenido += '<td class="td_center">';
                contenido += '<button onclick="ver_qr(\'' + resultado.datos[i].CODIGO_UNICO + '\', this)"><i class="fas fa-qrcode"></i><span class="solo-desktop"> QR</span></button>';
                contenido += '<button onclick="ver_consumos(' + resultado.datos[i].PUNTOCONTROL_ID + ')"><i class="fas fa-history"></i><span class="solo-desktop"> Consumo</span></button>';
                contenido += '</td>';
                contenido += '</tr>';
            }
        }

        contenido += '</table>';
        div_resultados.innerHTML = contenido;

        button.disabled = false;
    } catch (e) {
        console.log('panel_punto', e);
        button.disabled = false;
    }
}

function generar_qr(codigo_unico) {
    let qr = new QRious();
    //foreground: '#2e4f26',
    qr.set({
        background: 'white',
        backgroundAlpha: 0.8,
        foreground: 'black',
        foregroundAlpha: 0.8,
        level: 'H',
        padding: 25,
        size: 500,
        value: http + '/qr/captura/' + codigo_unico
    });

    return qr;
}

function ver_qr(codigo_unico, button) {
    button.disabled = true;

    var qr = generar_qr(codigo_unico);

    let codigo_qr_modal = document.getElementById('codigo_qr_modal');
    let codigo_qr_uuid = document.getElementById('codigo_qr_uuid');

    codigo_qr_modal.innerHTML = '<img src="' + qr.toDataURL() + '" style="border: 5px solid black;" alt="Imagen QR">';
    codigo_qr_uuid.innerHTML = codigo_unico;

    button.disabled = false;

    let modal = document.getElementById('modal_ver_qr');
    invocar_modal(modal);
}

function cargar_qr() {
    try {
        if (document.getElementById('imagenQR')) {
            let img = document.getElementById('imagenQR');
            let qr = generar_qr(qr_codigounico);
            img.src = qr.toDataURL();
        }
    } catch (e) {
        console.log('panel_punto', e);
    }

}

function ver_consumos(punto_id) {
    //to(http + '/panel/punto/' + punto_id);
    let modal = document.getElementById('modal_seleccionar_rango_consumos');
    document.getElementById('modal_rango_fecha_punto_id').value = punto_id;
    invocar_modal(modal);
}

async function ver_consumos_ok(button_element) {
    try {
        button_element.disabled = true;
        let punto_id = document.getElementById('modal_rango_fecha_punto_id').value;

        await buscarConsumos(punto_id, button_element);

        let modal = document.getElementById('modal_seleccionar_rango_consumos');
        cerrar_modal(modal);
        rangofechas_buscador();
        document.getElementById('modal_rango_fecha_punto_id').value = null;
        button_element.disabled = false;
    } catch (e) {
        console.log('panel_punto', e);
        button_element.disabled = false;
    }

}

async function buscarPunto(punto_id) {
    try {
        let entrada = {punto_id: punto_id};
        let datos = await fetch(http + '/qr/api_buscarPunto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();
        return resultado;
    } catch (e) {
        console.log('panel_punto', e);
        return null;
    }

}

function toggle_qr_informacion() {
    let div = document.getElementById('panel_informacion');
    let div_estilo = window.getComputedStyle(div);
    ;
    if (div_estilo.display === 'none') {
        div.style.display = '';
    } else {
        div.style.display = 'none';
    }
}

async function buscarConsumos(punto_id, button) {
    try {
        let fecha1 = document.getElementById('fecha1');
        let fecha2 = document.getElementById('fecha2');
        let div_resultados = document.getElementById('div_resultados');
        let contenido = '';

        fecha1.classList.remove('input-alerta');
        fecha2.classList.remove('input-alerta');

        button.disabled = true;

        if (fecha1.value.length === 0 || fecha2.value.length === 0 || fecha1.value > fecha2.value) {
            fecha1.classList.add('input-alerta');
            fecha2.classList.add('input-alerta');
            button.disabled = false;
            return;
        }

        let entrada = {punto_id: punto_id, fecha1: fecha1.value, fecha2: fecha2.value};
        let datos = await fetch(http + '/qr/api_listarConsumos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        let datos_punto = await buscarPunto(punto_id);

        if (datos_punto.datos.length > 0 && datos_punto.resultado != "0"
                && datos_punto.datos[0].resultado != "0") {

            contenido += '<div class="panel panel-exito" style="color: var(--negro) !important">';
            contenido += '<h3>Registro de consumo para el punto #' + datos_punto.datos[0].PUNTOCONTROL_NUMERO + '</h3>';
            contenido += '<b>C&oacute;digo &uacute;nico:</b> <code>' + datos_punto.datos[0].CODIGO_UNICO + '</code><br>';
            contenido += '<b>Ubicaci&oacute;n:</b> ' + datos_punto.datos[0].PUNTOCONTROL_UBICACION_LOCAL + '<br>';
            contenido += '<b>Geolocalizaci&oacute;n:</b> ' + posnull(datos_punto.datos[0].PUNTOCONTROL_GEOLOCALIZACION) + '<br>';
            contenido += 'Reporte de consumos comprendidos entre el <b>' + fecha1.value + '</b> y el <b>' + fecha2.value + '</b>';
            contenido += '</div>';
            contenido += '<div class="clearfix">&nbsp;</div>';

        }

        contenido += '<table class="responsive espaciado tabla-blanca tabla-sombra">';
        contenido += '<tr>';
        contenido += '<th style="width: 15%">FECHA Y HORA</th>';
        contenido += '<th style="width: 10%">MEDIDA INICIAL</th>';
        contenido += '<th style="width: 10%">MEDIDA ACTUAL</th>';
        contenido += '<th style="width: 15%">DIFERENCIA</th>';
        contenido += '<th style="width: 5%">CONSUMO</th>';
        contenido += '<th style="width: 5%">RECAMBIO</th>';
        contenido += '<th style="width: 40%"><i class="fas fa-cogs"></i></th>';
        contenido += '</tr>';

        if (resultado.datos.length === 0 || resultado.resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="7" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else if (resultado.datos[0].resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="7" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.datos[0].mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                var recambio_no = '<span class="texto-info-fuerte"><b>NO</b></span>';
                var recambio_si = '<span class="texto-alerta-fuerte"><b>SI</b></span>';
                var consumo_si = '<span class="texto-alerta-fuerte"><b>SI</b></span>';
                var consumo_no = '<span class="texto-exito-fuerte"><b>NO</b></span>';

                contenido += '<tr>';
                contenido += '<td class="td_center"><b>' + mysql_to_dtl(resultado.datos[i].PUNTOHISTORIAL_FECHAHORA) + '</b></td>';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOHISTORIAL_MEDIDAINICIAL) + ' ' + posnull(resultado.datos[i].UNIDADMEDIDA_SIMBOLO) + '</td>';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOHISTORIAL_MEDIDA) + ' ' + posnull(resultado.datos[i].UNIDADMEDIDA_SIMBOLO) + '</td>';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOHISTORIAL_CONSUMO) + ' ' + posnull(resultado.datos[i].UNIDADMEDIDA_SIMBOLO) + '</td>';
                contenido += '<td class="td_center">' + (resultado.datos[i].PUNTOHISTORIAL_HUBOCONSUMO == "0" ? consumo_no : consumo_si) + '</td>';
                contenido += '<td class="td_center">' + (resultado.datos[i].PUNTOHISTORIAL_RECAMBIO == "0" ? recambio_no : recambio_si) + '</td>';
                contenido += '<td class="td_center">';

                if (resultado.datos[i].PUNTOHISTORIAL_OBSERVACIONES != null && resultado.datos[i].PUNTOHISTORIAL_OBSERVACIONES.trim() !== "") {
                    //contenido += '<button onclick="ph_observacion(\'' + resultado.datos[i].PUNTOHISTORIAL_OBSERVACIONES + '\', \'' + mysql_to_dtl(resultado.datos[i].PUNTOHISTORIAL_FECHAHORA) + '\', this)"><i class="fas fa-sticky-note"></i><span class="solo-desktop"> Observaciones</span></button>';
                    contenido += resultado.datos[i].PUNTOHISTORIAL_OBSERVACIONES;
                } else {
                    contenido += '<small><i>Observaciones no registradas</i></small>';
                }

                contenido += '</td>';
                contenido += '</tr>';
            }
        }

        contenido += '</table>';

        console.log(resultado);
        button.disabled = false;
        div_resultados.innerHTML = contenido;
    } catch (e) {
        button.disabled = false;
        console.log('panel_punto', e);
    }

}

function ph_observacion(obs, hora, button) {

    try {
        button.disabled = true;
        let modal_ver_observaciones = document.getElementById('modal_ver_observaciones');
        let texto_observaciones = document.getElementById('texto_observaciones');

        texto_observaciones.innerHTML = '<h3><code>' + hora + '</code></h3>' + obs;

        invocar_modal(modal_ver_observaciones);
        button.disabled = false;
    } catch (e) {
        button.disabled = false;
        console.log('panel_punto', e);
    }

}

function posnull(variable) {
    let salida = '';
    if (variable === null || variable.trim().length === 0) {

    } else {
        salida = variable;
    }

    return salida;
}

/* ------------ FUNCIONES EN SERVICIO_PC ----------------- */

function actualizar_ins(button) {
    alert("En construccion");
}

function actualizar_ceb(button) {

}

async function tiene_ceb() {
    try {
        let entrada = {'local_id': local_id};
        let datos = await fetch(http + '/qr/api_listarpuntos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        if (resultado.datos[0].resultado == '0' ||
                resultado.datos.length === 0) {
            return false;
        } else {
            return resultado;
        }

    } catch (e) {
        console.log("panel_punto", e);
        return false;
    }
}

async function tiene_ceb_previo() {
    try {
        let entrada = {'codigo_unico_visita': visita_codigo_unico};
        let datos = await fetch(http + '/qr/api_servicioPunto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        if (resultado.datos[0].resultado == '0' ||
                resultado.datos.length === 0) {
            return false;
        } else {
            return resultado;
        }

    } catch (e) {
        console.log("panel_punto", e);
        return false;
    }
}

async function guardar_edicion_ceb(button) {
    try {
        button.disabled = true;
        if (document.getElementById('servicio_puntos')) {
            let filas = document.querySelectorAll('#tabla_editar_roedores tr:not(:first-child)');
            let historial = [];

            for (let i = 0; i < filas.length; i++) {
                let fila = filas[i];
                let id = fila.getAttribute('data-id');
                let phid = fila.getAttribute('data-phid');
                let medidaInicialInput = fila.querySelector(`input[name="medidainicial[${id}]"]`);
                let medidaActualInput = fila.querySelector(`input[name="medidaactual[${id}]"]`);
                let recambioCheckbox = fila.querySelector(`input[name="recambio[${id}]"]`);
                let observacionTextarea = fila.querySelector(`textarea[name="observacion[${id}]"]`);

                // Validar y convertir a número con decimales o asignar 0 si está vacío
                let medidaInicial = parseFloat(medidaInicialInput.value.trim()) || 0;
                let medidaActual = parseFloat(medidaActualInput.value.trim()) || 0;

                // Verificar el estado del checkbox para recambio
                let recambio = recambioCheckbox.checked ? 1 : 0;

                // Validar observación y registrar null si está vacía
                let observacion = observacionTextarea.value.trim() !== '' ? observacionTextarea.value : null;

                // Verificar si medidaInicial o medidaActual son vacíos o no son números
                if (isNaN(medidaInicial) || isNaN(medidaActual)) {
                    alert('Por favor, ingrese valores numéricos válidos para medida inicial y medida actual.');
                    medidaInicialInput.focus();
                    return; // Abortar la función
                }

                let ph = {
                    phid: phid,
                    medidaInicial: medidaInicial,
                    medidaActual: medidaActual,
                    recambio: recambio,
                    observacion: observacion
                };

                historial.push(ph);
            }

            let datos = await fetch(http + '/qr/api_editarConsumoPC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historial)
            });

            let resultados = await datos.json();
            console.log('redirigiendo a data_ceb');
            data_ceb();
        }
        button.disabled = false;
    } catch (e) {
        console.log('panel_puntos', e);
        button.disabled = false;
    }
}

async function guardar_nuevo_ceb(button) {
    try {
        button.disabled = true;
        if (document.getElementById('servicio_puntos')) {
            let filas = document.querySelectorAll('#tabla_nuevo_roedores tr:not(:first-child)');
            let historial = [];

            for (let i = 0; i < filas.length; i++) {
                let fila = filas[i];
                let id = fila.getAttribute('data-id');
                let medidaInicialInput = fila.querySelector(`input[name="medidainicial[${id}]"]`);
                let medidaActualInput = fila.querySelector(`input[name="medidaactual[${id}]"]`);
                let recambioCheckbox = fila.querySelector(`input[name="recambio[${id}]"]`);
                let observacionTextarea = fila.querySelector(`textarea[name="observacion[${id}]"]`);

                // Validar y convertir a número con decimales o asignar 0 si está vacío
                let medidaInicial = parseFloat(medidaInicialInput.value.trim()) || 0;
                let medidaActual = parseFloat(medidaActualInput.value.trim()) || 0;

                // Verificar el estado del checkbox para recambio
                let recambio = recambioCheckbox.checked ? 1 : 0;

                // Validar observación y registrar null si está vacía
                let observacion = observacionTextarea.value.trim() !== '' ? observacionTextarea.value : null;

                // Verificar si medidaInicial o medidaActual son vacíos o no son números
                if (isNaN(medidaInicial) || isNaN(medidaActual)) {
                    alert('Por favor, ingrese valores numéricos válidos para medida inicial y medida actual.');
                    medidaInicialInput.focus();
                    return; // Abortar la función
                }

                let ph = {
                    id: id,
                    medidaInicial: medidaInicial,
                    medidaActual: medidaActual,
                    recambio: recambio,
                    observacion: observacion,
                    visita_cu: visita_codigo_unico
                };

                historial.push(ph);
            }

            let datos = await fetch(http + '/qr/api_registrarConsumoPC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historial)
            });

            let resultados = await datos.json();
            console.log('redirigiendo a data_ceb');
            console.log(resultados);
            data_ceb();
        }
        button.disabled = false;
    } catch (e) {
        console.log('panel_puntos', e);
        button.disabled = false;
    }

}


async function data_ceb() {
    try {
        if (document.getElementById('servicio_puntos')) {
            let div = document.getElementById('servicio_puntos');
            let contenido = '';
            let ceb = await tiene_ceb();
            if (!ceb) {
                contenido += '<div class="panel" style="text-align:center">';
                contenido += 'El local al que hace referencia este servicio no tiene puntos de control de cebaderos';
                contenido += '</div>';
                div.innerHTML = contenido;
                return;
            }

            let ceb_previo = await tiene_ceb_previo();
            if (ceb_previo !== false) {
                mostrar_ceb_previo(ceb_previo);
                return;
            }

            let resultado = ceb;

            /* Si o si tiene puntos */
            contenido += '<hr>';
            contenido += '<form onsubmit="return false" id="form_nuevo_historial">';
            contenido += '<input type="hidden" id="nuevo_visita_cu" value="' + visita_codigo_unico + '">';
            contenido += '<button class="input-exito" onclick="guardar_nuevo_ceb(this)"><i class="fas fa-save"></i> Guardar datos</button>';
            contenido += '<div class="panel panel-exito" style="color: var(--negro) !important">';
            contenido += '<b>Instrucciones:</b> Actualmente este servicio no cuenta con registros de roedores. ' +
                    'Est&aacute; a punto de registrar un historial de consumos asociados a este servicio para los puntos de control de roedores ' +
                    'de este local. Se registrar&aacute; la misma fecha y hora que es consignada en los ' +
                    'datos del servicio y que cada historial ha sido tomado por usted (es decir, su usuario). ' +
                    'Para consignar consumos s&oacute;lo coloque un valor distinto de 0 en las medidas y en caso no haya habido consumo ' +
                    'basta con dejar las medidas en cero. Luego de guardar los datos se le redirigir&aacute; al historial de puntos del servicio ' +
                    'donde podr&aacute; editar los datos en caso de error o simplemente consultar los datos ingresados. ' +
                    '<br><br>En caso no haya podido tomarse la medida en alg&uacute;n punto de control, dejar en 0 las medidas, marcar recambio y anotar ' +
                    'el motivo del impedimento en las observaciones.';
            contenido += '</div><br>';
            contenido += '<table id="tabla_nuevo_roedores" class="responsive tabla-blanca tabla-cebra espaciado">' +
                    '<tr>' +
                    '<th style="width: 5%">N&uacute;mero</th>' +
                    '<th style="width: 30%">Nombre</th>' +
                    '<th style="width: 10%">Medida inicial</th>' +
                    '<th style="width: 10%">Medida actual</th>' +
                    '<th style="width: 5%">Recambio</th>' +
                    '<th style="width: 35%">Observaci&oacute;n</th>' +
                    '</tr>';

            for (var i = 0; i < resultado.datos.length; i++) {
                var pid = resultado.datos[i].PUNTOCONTROL_ID;
                contenido += '<tr data-id="' + pid + '">' +
                        '<td class="td_center">' + resultado.datos[i].PUNTOCONTROL_NUMERO + '</td>' +
                        '<td class="td_center">' + resultado.datos[i].PUNTOCONTROL_NOMBRE + '</td>' +
                        '<td class="td_center">' +
                        '<input name="medidainicial[' + pid + ']" ' +
                        'type="number" placeholder="En ' + resultado.datos[i].UNIDADMEDIDA + '" ' +
                        'value="0">' +
                        '</td>' +
                        '<td class="td_center">' +
                        '<input name="medidaactual[' + pid + ']" ' +
                        'type="number" placeholder="En ' + resultado.datos[i].UNIDADMEDIDA + '" ' +
                        'value="0">' +
                        '</td>' +
                        '<td class="td_center"><input name="recambio[' + pid + ']" type="checkbox"></td>' +
                        '<td class="td_center"><textarea name="observacion[' + pid + ']"></textarea></td>' +
                        '</tr>';
            }

            contenido += '</table>';
            contenido += '</form>';
            div.innerHTML = contenido;
        }

    } catch (e) {
        console.log("panel_punto", e);
    }
}

async function mostrar_ceb_previo(cebprevio) {
    try {
        if (document.getElementById('servicio_puntos')) {
            let div = document.getElementById('servicio_puntos');
            let contenido = '';

            let ceb = await tiene_ceb();
            if (!ceb) {
                console.log("Error interno. No se debio llegar a este punto: mostrar_ceb_previo porque no tiene puntos");
                contenido += '<div class="panel" style="text-align:center">';
                contenido += 'El local al que hace referencia este servicio no tiene puntos de control de cebaderos';
                contenido += '</div>';
                div.innerHTML = contenido;
                return;
            }

            let resultado = cebprevio;

            contenido += '<hr>';
            contenido += '<form onsubmit="return false" id="form_nuevo_historial">';
            contenido += '<input type="hidden" id="nuevo_visita_cu" value="' + visita_codigo_unico + '">';
            contenido += '<button class="input-exito" onclick="data_ceb_edicion(this)"><i class="fas fa-edit"></i> Editar datos</button>';
            contenido += '<div class="panel panel-exito" style="color: var(--negro) !important">';
            contenido += '<b>Instrucciones:</b> Esta es la informaci&oacute;n de consumos tomada en la realizaci&oacute;n del servicio. ' +
                    'Se pueden editar los valores obtenidos en caso haya alg&uacute;n percance con los datos pero la informaci&oacute;n ' +
                    'interna de ubicaci&oacute;n y otros metadatos tomados desde QR se mantendr&aacute;n internamente.';
            contenido += '</div><br>';
            contenido += '<table id="tabla_mostrar_roedores" class="responsive tabla-blanca tabla-cebra espaciado">' +
                    '<tr>' +
                    '<th style="width: 5%">N&uacute;mero</th>' +
                    '<th style="width: 20%">Nombre</th>' +
                    '<th style="width: 15%">Fecha</th>' +
                    '<th style="width: 5%">Consumo</th>' +
                    '<th style="width: 10%">Medida inicial</th>' +
                    '<th style="width: 10%">Medida actual</th>' +
                    '<th style="width: 5%">Recambio</th>' +
                    '<th style="width: 25%">Observaci&oacute;n</th>' +
                    '</tr>';

            for (var i = 0; i < resultado.datos.length; i++) {
                var recambio = (parseInt(resultado.datos[i].PH_RECAMBIO) === 1 ? '<b><i class="fas fa-exchange-alt fa-lg"></i></b>' : '&nbsp;');
                var consumo = (parseInt(resultado.datos[i].PH_HUBOCONSUMO) === 1 ? '<b><i class="fas fa-copyright fa-lg"></i></b>' : '&nbsp;');
                var obs = (posnull(resultado.datos[i].PH_OBSERVACIONES).trim().length === 0 ? '<i>Sin observaciones</i>' : resultado.datos[i].PH_OBSERVACIONES);
                var editado = (resultado.datos[i].PH_FECHAHORA == resultado.datos[i].PH_ULTIMAMODIFICACION ? '' : '<br><small>&Uacute;lt. Edici&oacute;n: ' + mysql_to_dtl(resultado.datos[i].PH_ULTIMAMODIFICACION) + '</small>');
                contenido += '<tr>' +
                        '<td class="td_center">' + resultado.datos[i].PUNTO_NUMERO + '</td>' +
                        '<td class="td_center">' + resultado.datos[i].PUNTO_NOMBRE + '</td>' +
                        '<td class="td_center">' + mysql_to_dtl(resultado.datos[i].PH_FECHAHORA) + editado + '</td>' +
                        '<td class="td_center">' + consumo + '</td>' +
                        '<td class="td_center">' + resultado.datos[i].PH_MEDIDAINICIAL + '</td>' +
                        '<td class="td_center">' + resultado.datos[i].PH_MEDIDAACTUAL + '</td>' +
                        '<td class="td_center">' + recambio + '</td>' +
                        '<td class="td_center">' + obs + '</textarea></td>' +
                        '</tr>';
            }

            contenido += '</table>';
            div.innerHTML = contenido;

        }
    } catch (e) {
        console.log("panel_punto", e);
    }

}

async function data_ceb_edicion(button) {
    try {
        if (document.getElementById('servicio_puntos')) {

            /* La edicion implica que siempre hay un ceb previo */
            let resultado = await tiene_ceb_previo();
            let div = document.getElementById('servicio_puntos');
            let contenido = '';

            contenido += '<hr>';
            contenido += '<form onsubmit="return false" id="form_nuevo_historial">';
            contenido += '<input type="hidden" id="nuevo_visita_cu" value="' + visita_codigo_unico + '">';
            contenido += '<button class="input-alerta" onclick="data_ceb()"><i class="fas fa-times"></i> Cancelar</button>';
            contenido += '<button class="input-exito" onclick="guardar_edicion_ceb(this)"><i class="fas fa-save"></i> Guardar datos</button>';
            contenido += '<div class="panel panel-exito" style="color: var(--negro) !important">';
            contenido += '<b>Instrucciones:</b> ' +
                    'Est&aacute; a punto de editar un historial de consumos asociados a este servicio para los puntos de control de roedores ' +
                    'de este local. ' +
                    'Para consignar consumos s&oacute;lo coloque un valor distinto de 0 en las medidas y en caso no haya habido consumo ' +
                    'basta con dejar las medidas en cero.' +
                    '<br><br>En caso no haya podido tomarse la medida en alg&uacute;n punto de control, dejar en 0 las medidas, marcar recambio y anotar ' +
                    'el motivo del impedimento en las observaciones.';
            contenido += '</div><br>';
            contenido += '<table id="tabla_editar_roedores" class="responsive tabla-blanca tabla-cebra espaciado">' +
                    '<tr>' +
                    '<th style="width: 5%">N&uacute;mero</th>' +
                    '<th style="width: 30%">Nombre</th>' +
                    '<th style="width: 10%">Medida inicial</th>' +
                    '<th style="width: 10%">Medida actual</th>' +
                    '<th style="width: 5%">Recambio</th>' +
                    '<th style="width: 35%">Observaci&oacute;n</th>' +
                    '</tr>';

            for (var i = 0; i < resultado.datos.length; i++) {

                var pid = resultado.datos[i].PUNTO_ID;
                var phid = resultado.datos[i].PH_ID;

                var recambio_checked = (parseInt(resultado.datos[i].PH_RECAMBIO) === 1 ? 'checked' : '');

                contenido += '<tr data-id="' + pid + '" data-phid="' + phid + '">' +
                        '<td class="td_center">' + resultado.datos[i].PUNTO_NUMERO + '</td>' +
                        '<td class="td_center">' + resultado.datos[i].PUNTO_NOMBRE + '</td>' +
                        '<td class="td_center">' +
                        '<input name="medidainicial[' + pid + ']" ' +
                        'type="number" value="' + resultado.datos[i].PH_MEDIDAINICIAL + '">' +
                        '</td>' +
                        '<td class="td_center">' +
                        '<input name="medidaactual[' + pid + ']" ' +
                        'type="number" value="' + resultado.datos[i].PH_MEDIDAACTUAL + '">' +
                        '</td>' +
                        '<td class="td_center"><input name="recambio[' + pid + ']" type="checkbox" ' + recambio_checked + '></td>' +
                        '<td class="td_center"><textarea name="observacion[' + pid + ']">' + posnull(resultado.datos[i].PH_OBSERVACIONES) + '</textarea></td>' +
                        '</tr>';
            }

            contenido += '</table>';
            contenido += '</form>';
            div.innerHTML = contenido;

        }
    } catch (e) {
        console.log("panel_punto", e);
    }

}

function actualizar_pc(button) {
    button.disabled = true;
    if (document.getElementById('tabla_roedores') || 
            document.getElementById('tabla_nuevo_roedores') ||
            document.getElementById('tabla_editar_roedores') ||
            document.getElementById('tabla_mostrar_roedores')) {
        data_ceb();
    } else if (document.getElementById('tabla_insectos')) {
        data_ins();
    }
    button.disabled = false;
}

function data_ins() {
    try {
        if (document.getElementById('servicio_puntos')) {
        }
    } catch (e) {
        console.log("panel_punto", e);
    }
}

function datos_servicio(button) {
    //boton que hace regresar a la pagina del servicio
    try {
        button.disabled = true;
        to(http + '/panel/servicio/' + visita_codigo_unico);
        button.disabled = false;
    } catch (e) {
        console.log("panel_documento", e);
        button.disabled = false;
    }

}