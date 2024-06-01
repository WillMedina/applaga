async function opciones_movil(select) {
    switch (select.value) {
        case "1":
            await listarArchivos(visita_id_static, this);
            break;
        case "2":
            break;
        default:
            break;
    }
}

async function listarVisitasConstancia() {
    try {
        let termino = document.getElementById('termino_busqueda_constancia').value;

        let html_vacio = '';
        let div_resultados = document.getElementById('resultado_lista');
        div_resultados.innerHTML = html_vacio;

        let entrada = {'termino': termino};
        let datos = await fetch(http + '/servicio/api_listarvisitas_constancia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        let resultado_final = '<form onsubmit="return false;">';
        resultado_final += '<table class="responsive tabla-blanca espaciado">';

        resultado_final += '<thead>';
        resultado_final += '<tr>';
        resultado_final += '<th class="td_center" style="width: 16.6%">CLIENTE</th>';
        resultado_final += '<th class="td_center" style="width: 16.6%">LOCAL</th>';
        resultado_final += '<th class="td_center solo-desktop" style="width: 16.6%">N° CONSTANCIA</th>';
        resultado_final += '<th class="td_center" style="width: 16.6%">INICIO</th>';
        resultado_final += '<th class="td_center solo-desktop" style="width: 16.6%">FIN</th>';
        resultado_final += '<th class="td_center" style="width: 16.6%">ACCIONES</th>';
        resultado_final += '</tr>';
        resultado_final += '</thead>';
        resultado_final += '<tbody>';

        if (resultado.datos.length == "0" || resultado.datos[0].resultado == '0') {
            var exc = (resultado.datos[0].resultado == '0' ? resultado.datos[0].mensaje : '');
            resultado_final += '<tr>';
            resultado_final += '<td colspan="9" class="td_center">';
            resultado_final += '<i class="fas fa-exclamation-triangle"></i> No se han encontrado servicios con este t&eacute;rmino de b&uacute;squeda. [' + exc + ']';
            resultado_final += '</td>';
            resultado_final += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                resultado_final += '<tr id="' + resultado.datos[i].VISITA_ID + '">';
                resultado_final += '<td class="td_center">[' + resultado.datos[i].CLIENTE_NOMBRECLAVE + '] ' + resultado.datos[i].CLIENTE_RAZONSOCIAL + '</td>';
                var alias = (resultado.datos[i].LOCAL_NOMBRECLAVE == 'null' || resultado.datos[i].LOCAL_NOMBRECLAVE == null) ? '' : '[' + resultado.datos[i].LOCAL_NOMBRECLAVE + '] ';
                resultado_final += '<td class="td_center">' + alias + resultado.datos[i].DIRECCION + '</td>';
                resultado_final += '<td class="td_center solo-desktop">' + resultado.datos[i].N_CONSTANCIA + '</td>';
                resultado_final += '<td class="td_center">' + mysql_to_dtl(resultado.datos[i].INICIO) + '</td>';
                resultado_final += '<td class="td_center solo-desktop">' + mysql_to_dtl(resultado.datos[i].FIN) + '</td>';
                resultado_final += '<td class="td_center">';
                resultado_final += '<button onclick="ver_visita(' + resultado.datos[i].VISITA_ID + ')"><i class="fas fa-file-alt"></i> INFORMACI&Oacute;N</button>';
                resultado_final += '</td>';
                resultado_final += '</tr>';
            }

        }


        resultado_final += '</tbody>';
        resultado_final += '</table>';
        resultado_final += '</form>';

        div_resultados.innerHTML = resultado_final;
        //div_resultados.insertAdjacentHTML('beforeend', resultado_final);
    } catch (e) {
        console.log('panel_servicios', e);
    }

}

async function listarVisitas() {
    try {
        let cliente_id = document.getElementById('cboClientes').value;
        let local_id = document.getElementById('cboLocal').value;
        let finicio = document.getElementById('fecha1').value;
        let ffin = document.getElementById('fecha2').value;
        let html_vacio = '';

        let div_resultados = document.getElementById('resultado_lista');
        div_resultados.innerHTML = html_vacio;

        let entrada = {'cliente_id': cliente_id, 'local_id': local_id, 'finicio': finicio, 'ffin': ffin};
        let datos = await fetch(http + '/servicio/api_listarvisitas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        let resultado_final = '<form onsubmit="return false;">';
        resultado_final += '<table class="responsive tabla-blanca espaciado">';

        resultado_final += '<thead>';
        resultado_final += '<tr>';
        resultado_final += '<th class="td_center" style="width: 16.6%">CLIENTE</th>';
        resultado_final += '<th class="td_center" style="width: 16.6%">LOCAL</th>';
        resultado_final += '<th class="td_center solo-desktop" style="width: 16.6%">N° CONSTANCIA</th>';
        resultado_final += '<th class="td_center" style="width: 16.6%">INICIO</th>';
        resultado_final += '<th class="td_center solo-desktop" style="width: 16.6%">FIN</th>';
        resultado_final += '<th class="td_center" style="width: 16.6%">ACCIONES</th>';
        resultado_final += '</tr>';
        resultado_final += '</thead>';
        resultado_final += '<tbody>';

        for (var i = 0; i < resultado.datos.length; i++) {
            resultado_final += '<tr id="' + resultado.datos[i].VISITA_ID + '">';
            resultado_final += '<td class="td_center">[' + resultado.datos[i].CLIENTE_NOMBRECLAVE + '] ' + resultado.datos[i].CLIENTE_RAZONSOCIAL + '</td>';
            var alias = (resultado.datos[i].LOCAL_NOMBRECLAVE == 'null' || resultado.datos[i].LOCAL_NOMBRECLAVE == null) ? '' : '[' + resultado.datos[i].LOCAL_NOMBRECLAVE + '] ';
            resultado_final += '<td class="td_center">' + alias + resultado.datos[i].DIRECCION + '</td>';
            resultado_final += '<td class="td_center solo-desktop">' + resultado.datos[i].N_CONSTANCIA + '</td>';
            resultado_final += '<td class="td_center">' + mysql_to_dtl(resultado.datos[i].INICIO) + '</td>';
            resultado_final += '<td class="td_center solo-desktop">' + mysql_to_dtl(resultado.datos[i].FIN) + '</td>';
            resultado_final += '<td class="td_center">';
            resultado_final += '<button onclick="ver_visita(' + resultado.datos[i].VISITA_ID + ')"><i class="fas fa-file-alt"></i> INFORMACI&Oacute;N</button>';
            resultado_final += '</td>';
            resultado_final += '</tr>';
        }

        if (resultado.datos.length == "0") {
            resultado_final += '<tr>';
            resultado_final += '<td colspan="6" class="td_center">';
            resultado_final += '<i class="fas fa-exclamation-triangle"></i> No se han encontrado servicios en ese local, cliente o rangos de fecha.';
            resultado_final += '</td>';
            resultado_final += '</tr>';

        }

        resultado_final += '</tbody>';
        resultado_final += '</table>';
        resultado_final += '</form>';

        div_resultados.innerHTML = resultado_final;
        //div_resultados.insertAdjacentHTML('beforeend', resultado_final);
    } catch (e) {
        console.log('panel_servicios', e);
    }

}

async function llenarClientes() {
    try {
        if (document.getElementById('cboClientes')) {
            let select = document.getElementById('cboClientes');

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

async function llenarOperarios() {
    try {
        let tbody = document.getElementById('gestionoperarios_listaOperarios');
        tbody.innerHTML = '<tr><td colspan="4" class="td_center">Recargando informaci&oacute;n de operarios...</td></tr>';
        let contenidofinal = '';
        let datos = await fetch(http + '/servicio/api_listaroperarios',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

        let resultado = await datos.json();
        for (var i = 0; i < resultado.datos.length; i++) {
            contenidofinal += '<tr>';
            contenidofinal += '<td class="td_center"><small>' + resultado.datos[i].NOMBRES + ' ' + resultado.datos[i].APELLIDOS + '</small></td>';
            contenidofinal += '<td class="td_center">' + resultado.datos[i].DNI + '</td>';
            contenidofinal += '<td class="td_center"><input type="checkbox" name="seleccionar_operario[]" value="' + resultado.datos[i].USUARIO_ID + '"></td>';
            contenidofinal += '<td class="td_center"><input type="checkbox" name="seleccionar_supervisor[]" value="' + resultado.datos[i].USUARIO_ID + '"></td>';
            contenidofinal += '</tr>';
        }

        tbody.innerHTML = contenidofinal;

    } catch (e) {
        console.log('panel_servicio', e);
    }
}

async function llenarTipoServicios() {
    try {
        let lista = document.getElementById('gestionservicios_listaServicios');
        lista.innerHTML = '<tr><td colspan="2" class="td_center">Cargando informaci&oacute;n de servicios...</td></tr>';
        let contenido = '';

        let datos = await fetch(http + '/servicio/api_listartiposdeservicio',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

        let resultado = await datos.json();
        for (var i = 0; i < resultado.datos.length; i++) {
            contenido += '<tr>';
            contenido += '<td class="td_center">';
            contenido += resultado.datos[i].NOMBRE;
            contenido += '</td>';
            contenido += '<td class="td_center"><input type="checkbox" name="seleccionar_servicios[]" value="' + resultado.datos[i].TIPOSERVICIO_ID + '"></td>';
            contenido += '<tr>';
        }

        lista.innerHTML = contenido;

    } catch (e) {
        console.log('panel_servicio', e);
    }

}

async function llenarProductos() {
    try {
        let lista = document.getElementById('gestionproductos_listaProductos');
        lista.innerHTML = '<tr><td colspan="2" class="td_center">Cargando informaci&oacute;n de servicios...</td></tr>';
        let contenido = '';
        let datos = await fetch(http + '/servicio/api_listarproductos',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

        let resultado = await datos.json();
        for (var i = 0; i < resultado.datos.length; i++) {
            var nombrecomercial = ((resultado.datos[i].NOMBRECOMERCIAL === null || resultado.datos[i].NOMBRECOMERCIAL.trim().length === 0) ? '' : ' (' + resultado.datos[i].NOMBRE + ')');
            contenido += '<tr>';
            contenido += '<td class="td_center">' + resultado.datos[i].NOMBRE + '' + nombrecomercial + '</td>';
            contenido += '<td class="td_center">' + posnull(resultado.datos[i].INGREDIENTEACTIVO) + '</td>';
            contenido += '<td class="td_center"><input type="checkbox" name="seleccionar_productos[]" value="' + resultado.datos[i].PRODUCTO_ID + '"></td>';
            contenido += '</tr>';
        }

        lista.innerHTML = contenido;
    } catch (e) {
        console.log('panel_servicio', e);
    }

}

async function llenarEquipos() {
    try {
        let lista = document.getElementById('gestionequipos_listaEquipos');
        lista.innerHTML = '<tr><td colspan="2" class="td_center">Cargando informaci&oacute;n de equipos...</td></tr>';
        let contenido = '';
        let datos = await fetch(http + '/servicio/api_listarequipos',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        let resultado = await datos.json();
        for (var i = 0; i < resultado.datos.length; i++) {
            contenido += '<tr>';
            contenido += '<td class="td_center">' + resultado.datos[i].NOMBRE + '</td>';
            contenido += '<td class="td_center"><input type="checkbox" name="seleccionar_equipos[]" value="' + resultado.datos[i].EQUIPO_ID + '"></td>';
            contenido += '</tr>';
        }

        lista.innerHTML = contenido;
    } catch (e) {
        console.log('panel_servicio', e);
    }
}

function llenarSupervisores() {
    try {
        let select_operarios = document.getElementById('cboOperarios');
        let select_superv = document.getElementById('cboSupervisor');
        var selectedOptions = Array.from(select_operarios.selectedOptions);

        // Borra todas las opciones existentes en el segundo select
        select_superv.innerHTML = '<option value="0">Sin supervisor</option>';

        // Crea las opciones en el segundo select basadas en las selecciones del primero
        selectedOptions.forEach(function (option) {
            var newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.text = option.text;
            select_superv.appendChild(newOption);
        });
    } catch (e) {
        console.log('panel_servicio', e);
    }
}

function nuevo_servicio_mensaje_error(mensaje) {
    document.getElementById('mensaje_error_contenido').innerHTML = mensaje;
    let modal = document.getElementById('mensaje_error');
    invocar_modal(modal);
}

function validaciones_editarservicio() {
    let salida = true;
    let gran_mensaje_raw = [];

    if (document.getElementById('cboClientes').value == 0) {
        //alert("Debe agregar la constancia que se uso durante el servicio");
        gran_mensaje_raw.push('Debe seleccionar un cliente');
        document.getElementById('cboClientes').classList.add('input-alerta');
        salida = false;
    } else {
        document.getElementById('cboClientes').classList.remove('input-alerta');
    }

    if (document.getElementById('cboLocal').value == 0) {
        //alert("Debe agregar la constancia que se uso durante el servicio");
        gran_mensaje_raw.push('Debe seleccionar un local del cliente');
        document.getElementById('cboLocal').classList.add('input-alerta');
        salida = false;
    } else {
        document.getElementById('cboLocal').classList.remove('input-alerta');
    }

    if (document.getElementById('txtNConstancia').value.trim().length === 0) {
        //alert("Debe agregar la constancia que se uso durante el servicio");
        gran_mensaje_raw.push('Debe agregar la constancia que se uso durante el servicio');
        document.getElementById('txtNConstancia').classList.add('input-alerta');
        salida = false;
    } else {
        document.getElementById('txtNConstancia').classList.remove('input-alerta');
    }


    if (document.getElementById('txtFechaInicio').value.trim().length === 0 ||
            document.getElementById('txtHoraInicio').value.trim().length === 0 ||
            document.getElementById('txtMinutosInicio').value.trim().length === 0 ||
            document.getElementById('txtFechaFin').value.trim().length === 0 ||
            document.getElementById('txtHoraFin').value.trim().length === 0 ||
            document.getElementById('txtMinutosFin').value.trim().length === 0) {

        gran_mensaje_raw.push('Revisar intervalo de fecha y hora del servicio realizado');

        document.getElementById('txtFechaInicio').classList.add('input-alerta');
        document.getElementById('txtHoraInicio').classList.add('input-alerta');
        document.getElementById('txtMinutosInicio').classList.add('input-alerta');
        document.getElementById('txtFechaFin').classList.add('input-alerta');
        document.getElementById('txtHoraFin').classList.add('input-alerta');
        document.getElementById('txtMinutosFin').classList.add('input-alerta');

        salida = false;
    } else {
        /*
         
         document.getElementById('txtInicio').classList.remove('input-alerta');
         document.getElementById('txtFin').classList.remove('input-alerta'); */
    }

    if (!salida) {
        let br = '<br>';

        let gran_mensaje = gran_mensaje_raw.join(br);
        nuevo_servicio_mensaje_error(gran_mensaje);
    }

    return salida;
}

function validaciones_registrarservicio() {
    let salida = true;
    let gran_mensaje_raw = [];

    if (document.getElementById('cboClientes').value == 0) {
        //alert("Debe agregar la constancia que se uso durante el servicio");
        gran_mensaje_raw.push('Debe seleccionar un cliente');
        document.getElementById('cboClientes').classList.add('input-alerta');
        salida = false;
    } else {
        document.getElementById('cboClientes').classList.remove('input-alerta');
    }

    if (document.getElementById('cboLocal').value == 0) {
        //alert("Debe agregar la constancia que se uso durante el servicio");
        gran_mensaje_raw.push('Debe seleccionar un local del cliente');
        document.getElementById('cboLocal').classList.add('input-alerta');
        salida = false;
    } else {
        document.getElementById('cboLocal').classList.remove('input-alerta');
    }

    if (document.getElementById('txtNConstancia').value.trim().length === 0) {
        //alert("Debe agregar la constancia que se uso durante el servicio");
        gran_mensaje_raw.push('Debe agregar la constancia que se uso durante el servicio');
        document.getElementById('txtNConstancia').classList.add('input-alerta');
        salida = false;
    } else {
        document.getElementById('txtNConstancia').classList.remove('input-alerta');
    }


    if (document.getElementById('txtFechaInicio').value.trim().length === 0 ||
            document.getElementById('txtHoraInicio').value.trim().length === 0 ||
            document.getElementById('txtMinutosInicio').value.trim().length === 0 ||
            document.getElementById('txtFechaFin').value.trim().length === 0 ||
            document.getElementById('txtHoraFin').value.trim().length === 0 ||
            document.getElementById('txtMinutosFin').value.trim().length === 0) {

        gran_mensaje_raw.push('Revisar intervalo de fecha y hora del servicio realizado');

        document.getElementById('txtFechaInicio').classList.add('input-alerta');
        document.getElementById('txtHoraInicio').classList.add('input-alerta');
        document.getElementById('txtMinutosInicio').classList.add('input-alerta');
        document.getElementById('txtFechaFin').classList.add('input-alerta');
        document.getElementById('txtHoraFin').classList.add('input-alerta');
        document.getElementById('txtMinutosFin').classList.add('input-alerta');

        salida = false;
    } else {
        /*
         
         document.getElementById('txtInicio').classList.remove('input-alerta');
         document.getElementById('txtFin').classList.remove('input-alerta'); */
    }

    if (document.getElementById('listaoperarios_input').value.trim().length === 0 ||
            document.getElementById('listasupervisores_input').value.trim().length === 0) {
        //alert('Debe agregar operarios y supervisores al servicio');
        gran_mensaje_raw.push('Debe agregar operarios y supervisores al servicio');
        salida = false;
    }

    if (document.getElementById('listaservicios_input').value.trim().length === 0) {
        //alert("Debe agregar tipos de servicio realizados");
        gran_mensaje_raw.push('Debe agregar tipos de servicio realizados');
        salida = false;
    }

    if (document.getElementById('listaproductos_input').value.trim().length === 0) {
        //alert("Debe agregar productos utilizados al servicio");
        gran_mensaje_raw.push('Debe agregar productos utilizados al servicio');
        salida = false;
    }

    if (document.getElementById('listaequipos_input').value.trim().length === 0) {
        //alert("Debe agregar equipos utilizados al servicio");
        gran_mensaje_raw.push('Debe agregar equipos utilizados al servicio');
        salida = false;
    }

    if (!salida) {
        let br = '<br>';

        let gran_mensaje = gran_mensaje_raw.join(br);
        nuevo_servicio_mensaje_error(gran_mensaje);
    }

    return salida;
}

function transformarHora(dateValue, hourValue, minuteValue, ampmValue) {
    try {
        if (ampmValue === 'PM' && parseInt(hourValue) !== 12) {
            hourValue = (parseInt(hourValue) + 12).toString();
        } else if (ampmValue === 'AM' && hourValue === '12') {
            hourValue = '00';
        }

        const formattedDateTime = `${dateValue}T${hourValue.padStart(2, '0')}:${minuteValue.padStart(2, '0')}`;

        return formattedDateTime;

    } catch (e) {
        console.log('panel_servicio', e);
        return null;
    }

}

async function buscarConstanciaExacta(n_constancia) {
    try {
        let entrada = {termino: n_constancia};
        let datos = await fetch(http + '/servicio/api_listarvisitas_constancia_exacta',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entrada)
                });
        let resultado = await datos.json();

        if (resultado === null || resultado.resultado == "0" ||
                resultado.datos[0].resultado == "0") {
            // si sucede esto es que no hay respuesta positiva de constancia
            return false;
        } else {
            return true;
        }

    } catch (e) {
        console.log('panel_servicio', e);
    }
}

async function registrarServicio(button) {
    try {
        button.disabled = true;
        let formulario = document.getElementById('formulario_nuevo_servicio');
        if (!validaciones_registrarservicio()) {
            formulario.scrollIntoView({behavior: 'smooth', block: 'start'});
            button.disabled = false;
            return;
        }

        let n_constancia = document.getElementById('txtNConstancia').value;
        let buscarConstancia = await buscarConstanciaExacta(n_constancia);
        if (buscarConstancia) {
            if (!confirm("ADVERTENCIA!!! - Ya existe un servicio con constancia " + n_constancia + ", ¿QUIERE REEMPLAZARLO CON ESTE SERVICIO? - Clic en Aceptar para reemplazarlo, Cancelar para volver y editar la de constancia")) {
                document.getElementById('txtNConstancia').classList.add("input-alerta");
                formulario.scrollIntoView({behavior: 'smooth', block: 'start'});
                document.getElementById('txtNConstancia').focus();
                button.disabled = false;
                return;
            }
        }

        let cliente_id = document.getElementById('cboClientes').value;
        let local_id = document.getElementById('cboLocal').value;
        let responsable = document.getElementById('txtResponsable').value;
        let cargo_responsable = document.getElementById('txtCargoResponsable').value;


        let tfi = document.getElementById('txtFechaInicio').value;
        let thi = document.getElementById('txtHoraInicio').value;
        let tmi = document.getElementById('txtMinutosInicio').value;
        let tff = document.getElementById('txtFechaFin').value;
        let thf = document.getElementById('txtHoraFin').value;
        let tmf = document.getElementById('txtMinutosFin').value;

        //let inicio = dtl_to_mysql(document.getElementById('txtInicio').value);
        //let fin = dtl_to_mysql(document.getElementById('txtFin').value);

        let inicio = transformarHora(tfi, thi, tmi, document.getElementById('cboAMPMInicio').value);
        let fin = transformarHora(tff, thf, tmf, document.getElementById('cboAMPMFin').value);

        let n_certificado = document.getElementById('txtNCertificado').value;
        let vencimiento_certificado = document.getElementById('txtVencimientoCertificado').value;
        let obs_reco = document.getElementById('txtObservacionesRecomendaciones').value;
        let obs_cli = document.getElementById('txtObservacionesCliente').value;
        let cond_int = document.getElementById('cboCondInt').value;
        let cond_ext = document.getElementById('cboCondExt').value;
        let visto_bueno = document.getElementById('cboVistoBueno').value;

        let entrada = {
            cliente_id: cliente_id,
            local_id: local_id,
            responsable: responsable,
            cargo_responsable: cargo_responsable,
            n_constancia: n_constancia,
            inicio: inicio,
            fin: fin,
            n_certificado: n_certificado,
            vencimiento_certificado: vencimiento_certificado,
            obs_reco: obs_reco,
            obs_cli: obs_cli,
            cond_int: cond_int,
            cond_ext: cond_ext,
            visto_bueno: visto_bueno
        };

        let datos = await fetch(http + '/servicio/api_registrarservicio',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entrada)
                });

        let resultado = await datos.json();

        if (resultado.datos[0].resultado == 1) {
            let visita_id = resultado.datos[0].VISITA_ID;

            let opregistrados = registrarServicio_Operarios(visita_id);
            let servicios_registrados = registrarServicio_TipoServicios(visita_id);
            let productos_registrados = registrarServicio_Productos(visita_id);
            let equipos_registrados = registrarServicio_Equipos(visita_id);

            if (!opregistrados || !servicios_registrados ||
                    !productos_registrados || !equipos_registrados) {
                //alert("Se registro correctamente el servicio con codigo " + visita_id + "- problemas internos");
            } else {
                //alert("Se registro correctamente el servicio con codigo " + visita_id);
            }

            to(http + "/panel/servicio/" + visita_id);
        } else {
            console.log(resultado);
            //alert('Ha ocurrido un error interno registrando el servicio');
            //to(http + "/panel/servicio/nuevo");
            nuevo_servicio_mensaje_error("Ha ocurrido un error interno registrando el servicio");
        }

        button.disabled = false;
    } catch (e) {
        console.log('panel_servicio', e);
        //alert('Ha ocurrido un error interno registrando el servicio');
        //to(http + "/panel/servicio/nuevo");
        nuevo_servicio_mensaje_error("Ha ocurrido un error interno registrando el servicio: " + e);
        button.disabled = false;
    }
}

async function editarServicio(button) {
    try {
        button.disabled = true;
        let formulario = document.getElementById('formulario_editar_servicio');
        if (!validaciones_editarservicio()) {
            formulario.scrollIntoView({behavior: 'smooth', block: 'start'});
            button.disabled = false;
            return;
        }

        let n_constancia = document.getElementById('txtNConstancia').value;
        let buscarConstancia = await buscarConstanciaExacta(n_constancia);
        if (n_constancia != predeterminados_editar.n_constancia) {
            if (buscarConstancia) {
                if (!confirm("ADVERTENCIA!!! - Ya existe un servicio previo con constancia " + n_constancia + ", ¿QUIERE REEMPLAZARLO CON ESTE SERVICIO? - Clic en Aceptar para reemplazarlo, Cancelar para volver y editar la de constancia")) {
                    document.getElementById('txtNConstancia').classList.add("input-alerta");
                    formulario.scrollIntoView({behavior: 'smooth', block: 'start'});
                    document.getElementById('txtNConstancia').focus();
                    button.disabled = false;
                    return;
                }
            }
        }

        let visita_id = document.getElementById('visita_id').value;
        let cliente_id = document.getElementById('cboClientes').value;
        let local_id = document.getElementById('cboLocal').value;
        let responsable = document.getElementById('txtResponsable').value;
        let cargo_responsable = document.getElementById('txtCargoResponsable').value;

        let tfi = document.getElementById('txtFechaInicio').value;
        let thi = document.getElementById('txtHoraInicio').value;
        let tmi = document.getElementById('txtMinutosInicio').value;
        let tff = document.getElementById('txtFechaFin').value;
        let thf = document.getElementById('txtHoraFin').value;
        let tmf = document.getElementById('txtMinutosFin').value;

        //let inicio = dtl_to_mysql(document.getElementById('txtInicio').value);
        //let fin = dtl_to_mysql(document.getElementById('txtFin').value);

        let inicio = transformarHora(tfi, thi, tmi, document.getElementById('cboAMPMInicio').value);
        let fin = transformarHora(tff, thf, tmf, document.getElementById('cboAMPMFin').value);

        let n_certificado = document.getElementById('txtNCertificado').value;
        let vencimiento_certificado = document.getElementById('txtVencimientoCertificado').value;
        let obs_reco = document.getElementById('txtObservacionesRecomendaciones').value;
        let obs_cli = document.getElementById('txtObservacionesCliente').value;
        let cond_int = document.getElementById('cboCondInt').value;
        let cond_ext = document.getElementById('cboCondExt').value;
        let visto_bueno = document.getElementById('cboVistoBueno').value;

        let entrada = {
            visita_id: visita_id,
            cliente_id: cliente_id,
            local_id: local_id,
            responsable: responsable,
            cargo_responsable: cargo_responsable,
            n_constancia: n_constancia,
            inicio: inicio,
            fin: fin,
            n_certificado: n_certificado,
            vencimiento_certificado: vencimiento_certificado,
            obs_reco: obs_reco,
            obs_cli: obs_cli,
            cond_int: cond_int,
            cond_ext: cond_ext,
            visto_bueno: visto_bueno
        };

        let datos = await fetch(http + '/servicio/api_editarservicio',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(entrada)
                });

        let resultado = await datos.json();

        if (resultado.datos[0].resultado == 1) {
            //let visita_id = document.getElementById('visita_id');
            /*
             let opregistrados = registrarServicio_Operarios(visita_id);
             let servicios_registrados = registrarServicio_TipoServicios(visita_id);
             let productos_registrados = registrarServicio_Productos(visita_id);
             let equipos_registrados = registrarServicio_Equipos(visita_id); 
             
             if (!opregistrados || !servicios_registrados ||
             !productos_registrados || !equipos_registrados) {
             //alert("Se registro correctamente el servicio con codigo " + visita_id + "- problemas internos");
             } else {
             //alert("Se registro correctamente el servicio con codigo " + visita_id);
             }
             */

            to(http + "/panel/servicio/" + visita_id);
        } else {
            console.log(resultado);
            nuevo_servicio_mensaje_error("Ha ocurrido un error interno editando el servicio");
        }

        button.disabled = false;
    } catch (e) {
        console.log('panel_servicio', e);
        nuevo_servicio_mensaje_error("Ha ocurrido un error interno registrando el servicio: " + e);
        button.disabled = false;
    }
}

async function registrarServicio_Equipos(visita_id) {
    try {
        let lista = document.getElementById("listaequipos_input").value;

        let entrada = {
            visita_id: visita_id,
            equipos: lista
        };

        let datos = await fetch(http + '/servicio/api_registrarServicio_Equipos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultados = await datos.json();
        if (resultados.resultado == 1) {
            return true;
        } else {
            console.log(resultados);
            return false;
        }

    } catch (e) {
        console.log('panel_servicios', e);
        return false;
    }

}

async function registrarServicio_Productos(visita_id) {
    try {
        let lista = document.getElementById("listaproductos_input").value;

        let entrada = {
            visita_id: visita_id,
            productos: lista
        };

        let datos = await fetch(http + '/servicio/api_registrarServicio_Productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultados = await datos.json();
        if (resultados.resultado == 1) {
            return true;
        } else {
            console.log(resultados);
            return false;
        }

    } catch (e) {
        console.log('panel_servicios', e);
        return false;
    }

}

async function registrarServicio_TipoServicios(visita_id) {
    try {
        let lista = document.getElementById("listaservicios_input").value;

        let entrada = {
            visita_id: visita_id,
            servicios: lista
        };

        let datos = await fetch(http + '/servicio/api_registrarServicio_TipoServicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultados = await datos.json();
        if (resultados.resultado == 1) {
            return true;
        } else {
            console.log(resultados);
            return false;
        }

    } catch (e) {
        console.log('panel_servicios', e);
        return false;
    }

}

async function registrarServicio_Operarios(visita_id) {
    try {

        let operarios = document.getElementById('listaoperarios_input').value;
        let supervisores = document.getElementById('listasupervisores_input').value;

        let entrada = {
            visita_id: visita_id,
            op: operarios,
            s: supervisores
        };

        let datos = await fetch(http + '/servicio/api_registrarServicio_Operarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultados = await datos.json();
        if (resultados.resultado == 1) {
            return true;
        } else {
            console.log(resultados);
            return false;
        }
    } catch (e) {
        console.log('panel_servicios', e);
        return false;
    }

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
        let datos = await fetch(http + '/servicio/api_listararchivos', {
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

function modal_anular_servicio() {
    let modal = document.getElementById("modal_anular_servicio");
    invocar_modal(modal);
}

async function anular_servicio_ok(button_element) {
    let modal = document.getElementById('modal_anular_servicio');
    let visita_id = visita_id_static;
    try {
        button_element.disabled = true;

        let entrada = {id: visita_id};
        let datos = await fetch(http + '/servicio/api_borrarServicio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        alert(resultado.datos[0].mensaje);
        cerrar_modal(modal);
        button_element.disabled = false;
        to(http + '/panel/servicio');

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_servicio', e);
        button_element.disabled = false;
    }
}

function cancelar_anular_servicio() {
    let modal = document.getElementById("modal_anular_servicio");
    cerrar_modal(modal);
}

function modal_gestionar_operarios() {
    let modal = document.getElementById("gestion_operarios");
    llenarOperarios();
    invocar_modal(modal);
}

async function modal_gestionar_operarios_seleccionar() {
    try {
        let s_operarios = document.querySelectorAll('input[name="seleccionar_operario[]"]');
        let s_supervisores = document.querySelectorAll('input[name="seleccionar_supervisor[]"]');

        let operarios = [];
        let supervisores = [];

        s_operarios.forEach(checkbox => {
            if (checkbox.checked) {
                operarios.push(checkbox.value);
            }
        });

        s_supervisores.forEach(checkbox => {
            if (checkbox.checked) {
                supervisores.push(checkbox.value);
            }
        });

        if (operarios.length === 0 || supervisores.length === 0) {
            alert("Debe seleccionar al menos un operario y un supervisor");
            return;
        }

        let operarios_final = [...new Set(supervisores.concat(operarios))];

        let datos = await fetch(http + '/servicio/api_listaroperarios',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        //listaOperarios
        let resultado = await datos.json();

        let tbody_final = document.getElementById('listaOperarios');
        let contenido_final = '';

        if (resultado.datos.length === 0) {
            contenido_final += '<li>';
            contenido_final += 'Aqu&iacute; se listar&aacute;n los Operarios participantes en el servicio';
            contenido_final += '</li>';
        }

        for (var i = 0; i < resultado.datos.length; i++) {
            if (operarios_final.includes(resultado.datos[i].USUARIO_ID)) {
                contenido_final += '<li>';
                if (supervisores.includes(resultado.datos[i].USUARIO_ID)) {
                    contenido_final += '<span style="color:var(--info-fuerte);font-weight:bold">[SUPERVISOR]</span> ';
                } else {
                    contenido_final += '';
                }

                contenido_final += resultado.datos[i].NOMBRES + ' ' + resultado.datos[i].APELLIDOS;
                contenido_final += ' <span class="solo-desktop">(DNI: ' + resultado.datos[i].DNI + ')</span>';
                contenido_final += '</li>';
            }
        }

        let cadena_operarios = operarios_final.join(',');
        let cadena_supervisores = supervisores.join(',');

        document.getElementById('listaoperarios_input').value = cadena_operarios;
        document.getElementById('listasupervisores_input').value = cadena_supervisores;

        tbody_final.innerHTML = contenido_final;

        modal_gestionar_operarios_cerrar();
    } catch (e) {
        console.log('panel_servicios', e);
    }
}

function modal_gestionar_operarios_cerrar() {
    let modal = document.getElementById("gestion_operarios");
    let tbody = document.getElementById('gestionoperarios_listaOperarios');
    tbody.innerHTML = '';
    cerrar_modal(modal);
}

function modal_gestionar_servicios() {
    let modal = document.getElementById("gestion_serviciosrealizados");
    llenarTipoServicios();
    invocar_modal(modal);
}

async function modal_gestionar_servicios_seleccionar() {
    try {
        let s_servicios = document.querySelectorAll('input[name="seleccionar_servicios[]"]');
        let servicios = [];

        s_servicios.forEach(checkbox => {
            if (checkbox.checked) {
                servicios.push(checkbox.value);
            }
        });

        if (servicios.length === 0) {
            alert("Debe seleccionar al menos un servicio");
            return;
        }

        let datos = await fetch(http + '/servicio/api_listartiposdeservicio',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

        let resultado = await datos.json();
        let tbody_final = document.getElementById('listaServiciosrealizados');
        let contenido_final = '';

        if (resultado.datos.length === 0) {
            contenido_final += '<li>Aqu&iacute; se listar&aacute;n los servicios efectuados</li>';
        }

        for (var i = 0; i < resultado.datos.length; i++) {
            if (servicios.includes(resultado.datos[i].TIPOSERVICIO_ID)) {
                contenido_final += '<li>' + resultado.datos[i].NOMBRE + '</li>';
            }
        }

        let cadena_servicios = servicios.join(',');
        document.getElementById('listaservicios_input').value = cadena_servicios;

        tbody_final.innerHTML = contenido_final;
        modal_gestionar_servicios_cerrar();

    } catch (e) {
        console.log('panel_servicios', e);
    }
}

function modal_gestionar_servicios_cerrar() {
    let modal = document.getElementById("gestion_serviciosrealizados");
    let tbody = document.getElementById('gestionservicios_listaServicios');
    tbody.innerHTML = '';
    cerrar_modal(modal);
}

function modal_gestionar_productos() {
    let modal = document.getElementById("gestion_productos");
    llenarProductos();
    invocar_modal(modal);
}

async function modal_gestionar_productos_seleccionar() {
    try {
        let s_productos = document.querySelectorAll('input[name="seleccionar_productos[]"]');
        let productos = [];

        s_productos.forEach(checkbox => {
            if (checkbox.checked) {
                productos.push(checkbox.value);
            }
        });

        if (productos.length === 0) {
            alert("Debe seleccionar al menos un producto");
            return;
        }

        let datos = await fetch(http + '/servicio/api_listarproductos',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

        let resultado = await datos.json();
        let tbody_final = document.getElementById('listaProductos');
        let contenido_final = '';

        if (resultado.datos.length === 0) {
            contenido_final += '<li>Aqu&iacute; se listar&aacute;n los productos utilizados</li>';
        }

        for (var i = 0; i < resultado.datos.length; i++) {
            if (productos.includes(resultado.datos[i].PRODUCTO_ID)) {
                var nombrecomercial = ((resultado.datos[i].NOMBRECOMERCIAL === null || resultado.datos[i].NOMBRECOMERCIAL.trim().length === 0) ? '' : ' (' + resultado.datos[i].NOMBRE + ')');
                var ingredienteactivo = ((resultado.datos[i].INGREDIENTEACTIVO === null || resultado.datos[i].INGREDIENTEACTIVO.trim().length === 0) ? '' : ' [' + resultado.datos[i].INGREDIENTEACTIVO + ']');
                contenido_final += '<li>' + resultado.datos[i].NOMBRE + '' + nombrecomercial + '' + ingredienteactivo + '</li>';
            }
        }

        let cadena_productos = productos.join(',');
        document.getElementById('listaproductos_input').value = cadena_productos;
        tbody_final.innerHTML = contenido_final;

        modal_gestionar_productos_cerrar();
    } catch (e) {
        console.log('panel_servicio', e);
    }

}

function modal_gestionar_productos_cerrar() {
    let modal = document.getElementById("gestion_productos");
    let tbody = document.getElementById('gestionproductos_listaProductos');
    tbody.innerHTML = '';
    cerrar_modal(modal);
}

function modal_gestionar_equipos() {
    let modal = document.getElementById("gestion_equipos");
    llenarEquipos();
    invocar_modal(modal);
}

async function modal_gestionar_equipos_seleccionar() {
    try {
        let s_equipos = document.querySelectorAll('input[name="seleccionar_equipos[]"]');
        let equipos = [];

        s_equipos.forEach(checkbox => {
            if (checkbox.checked) {
                equipos.push(checkbox.value);
            }
        });

        if (equipos.length === 0) {
            alert("Debe seleccionar al menos un equipo");
            return;
        }

        let datos = await fetch(http + '/servicio/api_listarequipos',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

        let resultado = await datos.json();
        let tbody_final = document.getElementById('listaEquipos');
        let contenido_final = '';

        if (resultado.datos.length === 0) {
            contenido_final += '<li>Aqu&iacute; se listar&aacute;n los equipos utilizados</li>';
        }

        for (var i = 0; i < resultado.datos.length; i++) {
            if (equipos.includes(resultado.datos[i].EQUIPO_ID)) {
                contenido_final += '<li>' + resultado.datos[i].NOMBRE + '</li>';
            }
        }

        let cadena_equipos = equipos.join(',');
        document.getElementById('listaequipos_input').value = cadena_equipos;
        tbody_final.innerHTML = contenido_final;

        modal_gestionar_equipos_cerrar();
    } catch (e) {
        console.log('panel_servicios', e);
    }
}

function modal_gestionar_equipos_cerrar() {
    let modal = document.getElementById("gestion_equipos");
    let tbody = document.getElementById('gestionequipos_listaEquipos');
    tbody.innerHTML = '';
    cerrar_modal(modal);
}

function busqueda_por_rango() {
    try {
        let boton = document.getElementById('search_rango');
        let div = document.getElementById('busquedas_rangos');

        let otroboton = document.getElementById('search_constancia');
        let otrodiv = document.getElementById('busquedas_nconstancia');

        boton.style.display = 'none';
        div.style.display = '';

        otroboton.style.display = '';
        otrodiv.style.display = 'none';

    } catch (e) {
        console.log('panel_servicios', e);
    }
}

if (document.getElementById('txtHoraInicio')) {
    document.getElementById('txtHoraInicio').addEventListener('blur', function () {
        validateHour(this);
    });

}

if (document.getElementById('txtMinutosInicio')) {
    document.getElementById('txtMinutosInicio').addEventListener('blur', function () {
        validateMinute(this);
    });
}

if (document.getElementById('txtHoraFin')) {
    document.getElementById('txtHoraFin').addEventListener('blur', function () {
        validateHour(this);
    });
}

if (document.getElementById('txtMinutosFin')) {
    document.getElementById('txtMinutosFin').addEventListener('blur', function () {
        validateMinute(this);
    });
}

//esto para borrar cualquier clase css de los inputs en el formulario
if (document.getElementById('formulario_nuevo_servicio')) {
    document.addEventListener('click', function (event) {
        let formulario = document.getElementById('formulario_nuevo_servicio');
        if (event.target !== formulario && !formulario.contains(event.target)) {
            borrarValidacionesRojas(formulario);
        }
    });
}

function borrarValidacionesRojas(formulario) {
    let inputs = formulario.getElementsByTagName('input');
    let combos = formulario.getElementsByTagName('select');

    for (let input of inputs) {
        //input.className = '';
        //input.classList.remove('input-alerta');
        input.addEventListener('click', function () {
            this.classList.remove('input-alerta');
        });
    }

    for (let combo of combos) {
        //combo.classList.remove('input-alerta');
        combo.addEventListener('click', function () {
            this.classList.remove('input-alerta');
        });
    }
}

function validateHour(input) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < 1 || value > 12) {
        input.value = '';
    }
}

function validateMinute(input) {
    const value = parseInt(input.value);
    if (isNaN(value) || value < 0 || value > 59) {
        input.value = '';
    }
}

function busqueda_por_constancia() {
    try {
        let boton = document.getElementById('search_constancia');
        let div = document.getElementById('busquedas_nconstancia');

        let otroboton = document.getElementById('search_rango');
        let otrodiv = document.getElementById('busquedas_rangos');

        boton.style.display = 'none';
        div.style.display = '';

        otroboton.style.display = '';
        otrodiv.style.display = 'none';

    } catch (e) {
        console.log('panel_servicios', e);
    }
}

function transformarHoraInverso(fechaHoraString, fechaInput, horaInput, minutoInput, ampmInput) {
    try {
        const partes = fechaHoraString.split(' ');
        const fechaPartes = partes[0].split('-');
        const horaPartes = partes[1].split(':');

        fechaInput.value = partes[0];

        let hora = parseInt(horaPartes[0]);
        if (hora > 12) {
            hora -= 12;
            ampmInput.value = "PM";
        } else {
            ampmInput.value = "AM";
        }

        horaInput.value = hora;
        minutoInput.value = parseInt(horaPartes[1]);

        console.log('Transformacion inversa: ' + fechaHoraString);
    } catch (e) {
        console.log('panel_servicios (aux)', e);
    }

}

function set_combo(cbo_id, valorPredeterminado) {
    try {
        const comboBox = document.getElementById(cbo_id);
        for (let i = 0; i < comboBox.options.length; i++) {
            if (comboBox.options[i].value === valorPredeterminado) {
                comboBox.selectedIndex = i;
                break;
            }
        }
    } catch (e) {
        console.log('panel_servicios (aux)', e);
    }

}

async function llenar_datos_edicion() {
    try {
        if (document.getElementById('formulario_editar_servicio')) {
            await llenarClientes();
            await set_combo('cboClientes', predeterminados_editar.cliente_id);
            await llenarLocales();
            set_combo('cboLocal', predeterminados_editar.local_id);
            set_combo('cboCondInt', predeterminados_editar.cond_int);
            set_combo('cboCondExt', predeterminados_editar.cond_ext);
            set_combo('cboVistoBueno', predeterminados_editar.visto_bueno);

            transformarHoraInverso(
                    predeterminados_editar.dt_inicio,
                    document.getElementById('txtFechaInicio'),
                    document.getElementById('txtHoraInicio'),
                    document.getElementById('txtMinutosInicio'),
                    document.getElementById('cboAMPMInicio')
                    );

            transformarHoraInverso(
                    predeterminados_editar.dt_fin,
                    document.getElementById('txtFechaFin'),
                    document.getElementById('txtHoraFin'),
                    document.getElementById('txtMinutosFin'),
                    document.getElementById('cboAMPMFin')
                    );

            //esta parte para evitar que surgan errores asociados al input date y mala fecha
            if (predeterminados_editar.v_certificado.trim().length > 0) {
                document.getElementById('txtVencimientoCertificado').value = predeterminados_editar.v_certificado;
            }
        }
    } catch (e) {
        console.log('panel_servicios', e);
    }

}

function modal_subir_archivos(button) {
    button.disabled = true;
    try {
        let modal = document.getElementById("modal_subir_archivos");
        invocar_modal(modal);
        button.disabled = false;
    } catch (e) {
        console.log("panel_servicio", e);
        button.disabled = false;
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