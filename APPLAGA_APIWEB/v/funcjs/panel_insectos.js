async function llenarClientes() {
    try {
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

function ver_consumos(punto_id) {
    //to(http + '/panel/punto/' + punto_id);
    let modal = document.getElementById('modal_seleccionar_rango_consumos');
    document.getElementById('modal_rango_fecha_punto_id').value = punto_id;
    invocar_modal(modal);
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
        let datos = await fetch(http + '/qr/api_listarpuntosinsectos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        contenido += '<table class="responsive espaciado tabla-blanca tabla-sombra">';
        contenido += '<tr>';
        contenido += '<th style="width: 25%">N&Uacute;MERO</th>';
        contenido += '<th style="width: 25%">UBICACI&Oacute;N</th>';
        contenido += '<th style="width: 25%">MODELO</th>';
        contenido += '<th style="width: 25%"><i class="fas fa-cogs"></i></th>';
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
                contenido += '<td class="td_center solo-desktop">' + posnull(resultado.datos[i].MODELO) + '</td>';
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
        console.log('panel_punto_insectos', e);
        button.disabled = false;
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
        let datos = await fetch(http + '/qr/api_listarConsumosInsectos', {
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
        contenido += '<div class="panel panel-advertencia" style="color: var(--negro) !important">';
        contenido += '<b><u>Leyenda</u></b><br>Le = Lepid&oacute;pteros, MLe = Microlepid&oacute;pteros, He = Hem&iacute;pteros, ';
        contenido += 'Co = Cole&oacute;pteros, M = Moscas, Mo = Mosquitos, O = Otros';
        contenido += '</div><div class="clearfix">&nbsp;</div>';
        contenido += '<table class="responsive espaciado tabla-blanca tabla-sombra ultima-fila-resaltada">';
        contenido += '<tr>';
        contenido += '<th><small>FECHA/HORA</small></th>';
        contenido += '<th><small>MES</small></th>';
        contenido += '<th><small>PRESENCIA</small></th>';
        contenido += '<th><small>DETERIORO</small></th>';
        contenido += '<th><small>RECAMBIO</small></th>';
        contenido += '<th><small>Le</small></th>';
        contenido += '<th><small>MLe</small></th>';
        contenido += '<th><small>He</small></th>';
        contenido += '<th><small>Co</small></th>';
        contenido += '<th><small>M</small></th>';
        contenido += '<th><small>Mo</small></th>';
        contenido += '<th><small>O</small></th>';
        contenido += '<th><small>TOTAL</small></th>';
        contenido += '<th style="width:20%"><i class="fas fa-cogs"></i></th>';
        contenido += '</tr>';

        if (resultado.datos.length === 0 || resultado.resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="20" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else if (resultado.datos[0].resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="20" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.datos[0].mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                var recambio = (resultado.datos[i].PUNTOHISTORIAL_RECAMBIO == "-" ? '' : (resultado.datos[i].PUNTOHISTORIAL_RECAMBIO == "1" ? 'SI' : 'NO'));

                var mes_nombre = (mes(parseInt(resultado.datos[i].PUNTOHISTORIAL_MONTH, 10))).toUpperCase();
                console.log('mes', mes_nombre, resultado.datos[i].PUNTOHISTORIAL_MONTH);
                contenido += '<tr>';
                contenido += '<td class="td_center"><b>' + mysql_to_dtl(resultado.datos[i].PUNTOHISTORIAL_FECHAHORA) + '</b></td>';
                contenido += '<td class="td_center">' + mes_nombre + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_PRESENCIA + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_DETERIORO + '</td>';
                contenido += '<td class="td_center">' + recambio + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_LEPIDOPTEROS + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_MICROLEPIDOPTEROS + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_HEMIPTEROS + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_COLEOPTEROS + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_MOSCAS + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_MOSQUITOS + '</td>';
                contenido += '<td class="td_center">' + resultado.datos[i].PUNTOHISTORIAL_OTROS + '</td>';
                contenido += '<td class="td_center" style="background-color: var(--advertencia-leve) !important">' + resultado.datos[i].PUNTOHISTORIAL_TOTALINSECTOS + '</td>';
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

async function buscarPunto(punto_id) {
    try {
        let entrada = {punto_id: punto_id};
        let datos = await fetch(http + '/qr/api_buscarPuntoInsectos', {
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
        let datos = await fetch(http + '/qr/api_listarConsumoInsectosMesAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        contenido += '<div class="panel panel-advertencia" style="color: var(--negro) !important">';
        contenido += '<b><u>Leyenda</u></b><br>Le = Lepid&oacute;pteros, MLe = Microlepid&oacute;pteros, He = Hem&iacute;pteros, ';
        contenido += 'Co = Cole&oacute;pteros, M = Moscas, Mo = Mosquitos, O = Otros';
        contenido += '</div><div class="clearfix">&nbsp;</div>';
        contenido += '<table class="responsive espaciado tabla-blanca tabla-sombra ultima-fila-resaltada">';
        contenido += '<tr>';
        contenido += '<th>N&Uacute;MERO</th>';
        contenido += '<th>UBICACI&Oacute;N</th>';
        contenido += '<th>MES</th>';
        contenido += '<th>TIPO</th>';
        contenido += '<th colspan="2">LE</th>';
        contenido += '<th colspan="2">MLE</th>';
        contenido += '<th colspan="2">HE</th>';
        contenido += '<th colspan="2">CO</th>';
        contenido += '<th colspan="2">M</th>';
        contenido += '<th colspan="2">MO</th>';
        contenido += '<th colspan="2">O</th>';
        contenido += '<th>TOTAL</th>';
        contenido += '</tr>';

        if (resultado.datos.length === 0 || resultado.resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="20" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else if (resultado.datos[0].resultado == "0") {
            contenido += '<tr>';
            contenido += '<td colspan="20" class="td_center">';
            contenido += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.datos[0].mensaje;
            contenido += '</td>';
            contenido += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                var mes_nombre = (mes(parseInt(resultado.datos[i].MES, 10))).toUpperCase() + '-' + posnull(resultado.datos[i].YEAR);
                console.log(mes_nombre);
                contenido += '<tr>';
                contenido += '<td class="td_center">' + posnull(resultado.datos[i].PUNTOCONTROL_NUMERO) + '</td>';
                contenido += '<td class="td_center"><small>' + posnull(resultado.datos[i].PUNTOCONTROL_UBICACION) + '</small></td>';
                contenido += '<td class="td_center">' + mes_nombre + '</td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOCONTROL_TIPO_NC) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_LEPIDOPTEROS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_LE) + '%</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_MICROLEPIDOPTEROS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_MLE) + '%</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_HEMIPTEROS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_HE) + '%</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_COLEOPTEROS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_CO) + '%</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_MOSCAS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_M) + '%</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_MOSQUITOS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_MO) + '%</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_OTROS) + '</small></td>';
                contenido += '<td class="td_center"><small>' + parserCol(resultado.datos[i].PUNTOHISTORIAL_PRJ_O) + '%</small></td>';
                contenido += '<td class="td_center" style="background-color: var(--advertencia-leve) !important">' + parserCol(resultado.datos[i].PUNTOHISTORIAL_TOTAL) + '</td>';
                contenido += '</tr>';
            }
        }

        contenido += '<tfoot>';
        contenido += '<tr>';
        contenido += '<th>N&Uacute;MERO</th>';
        contenido += '<th>UBICACI&Oacute;N</th>';
        contenido += '<th>MES</th>';
        contenido += '<th>TIPO</th>';
        contenido += '<th colspan="2">LE</th>';
        contenido += '<th colspan="2">MLE</th>';
        contenido += '<th colspan="2">HE</th>';
        contenido += '<th colspan="2">CO</th>';
        contenido += '<th colspan="2">M</th>';
        contenido += '<th colspan="2">MO</th>';
        contenido += '<th colspan="2">O</th>';
        contenido += '<th>TOTAL</th>';
        contenido += '</tr>';
        contenido += '</tfoot>';

        contenido += '</table>';
        div_resultados.innerHTML = contenido;

        button.disabled = false;

    } catch (e) {
        console.log(e);
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
        value: http + '/qr/icaptura/' + codigo_unico
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
        let img = document.getElementById('imagenQR');
        let qr = generar_qr(qr_codigounico);
        img.src = qr.toDataURL();
    } catch (e) {
        console.log('panel_punto', e);
    }

}

function parserCol(entrada) {
    let salida = '';
    try {
        if (entrada == 0) {
            salida = '<span style="color: var(--verde-applaga) !important">' + entrada + '</span>';
        } else {
            //salida = '<span style="color: var(--alerta-fuerte) !important">' + entrada + '</span>';
            salida = entrada;
        }
    } catch (e) {
        console.log('panel_insectos', e);
        salida = entrada;
    }

    return salida;
}

function posnull(variable) {
    let salida = '';
    if (variable === null || variable.trim().length === 0) {

    } else {
        salida = variable;
    }

    return salida;
}
