function cerrar_sesion() {
    salir();
}

async function iniciar_sesion() {
    try {
        if (document.getElementById('login')) {
            let u = document.getElementById('txtUsuario').value;
            let p = document.getElementById('txtPass').value;
            let codigo_unico = document.getElementById('codigo_unico').value;

            if (u.length === 0 || p.length === 0) {
                alert("Debe llenar los campos para poder autenticarse");
                document.getElementById('txtUsuario').focus();
            } else {
                let datos = {usuario: u, pass: p};
                let respuesta = await fetch(http + '/login/c_login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datos)
                });

                let resultado = await respuesta.json();

                if (resultado.resultado == "1") {
                    to(http + "/qr/captura/" + codigo_unico);
                    return;
                }

                alert(resultado.mensaje);
            }
        }
    } catch (e) {
        console.log('captura', e);
    }
}

function salir() {
    if (confirm("Está seguro que desea salir?")) {
        to(http + "/login/c_logout");
    }
}

function to(url) {
    window.location.href = url;
}

function registrar_consumo(button_element) {
    try {
        var cboregistro = document.getElementById("cboConsumo");
        var opcionSeleccionada = cboregistro.options[cboregistro.selectedIndex];
        var opcion_elegida = opcionSeleccionada.textContent;

        document.getElementById('span_registro').innerHTML = opcion_elegida;
        document.getElementById('span_medidainicial').innerHTML = document.getElementById('txtMedidaInicial').value;
        document.getElementById('span_medidaactual').innerHTML = document.getElementById('txtMedidaActual').value;

        var cborecambio = document.getElementById("cboRecambio");
        var opcionSeleccionada2 = cborecambio.options[cborecambio.selectedIndex];
        var opcion_elegida2 = opcionSeleccionada2.textContent;

        document.getElementById('span_observaciones').innerHTML = ((document.getElementById('txtObservaciones').value.trim().length === 0) ? '<i>No se ingres&oacute; observaciones</i>' : '<i>' + document.getElementById('txtObservaciones').value + '</i')
        document.getElementById('span_recambio').innerHTML = opcion_elegida2;

        document.getElementById('tabla_formulario_captura').style.display = 'none';
        document.getElementById('tabla_formulario_confirmacion_captura').style.display = '';
    } catch (e) {
        console.log('captura', e);
        button_element.disabled = false;
    }
}

function cancelar_consumo_ok(button_element) {
    try {
        document.getElementById('tabla_formulario_captura').style.display = '';
        document.getElementById('tabla_formulario_confirmacion_captura').style.display = 'none';

        document.getElementById('span_registro').innerHTML = '';
        document.getElementById('span_medidainicial').innerHTML = '';
        document.getElementById('span_medidaactual').innerHTML = '';

        document.getElementById('span_observaciones').innerHTML = '';
        document.getElementById('span_recambio').innerHTML = '';
    } catch (e) {
        console.log('captura', e);
        button_element.disabled = false;
    }
}

async function registrar_consumo_ok(button_element) {
    try {
        button_element.disabled = true;
        var geolat = ((document.getElementById('geo_lat').value.trim().length === 0) ? null : document.getElementById('geo_lat').value);
        var geolong = ((document.getElementById('geo_long').value.trim().length === 0) ? null : document.getElementById('geo_long').value);
        var visita = ((document.getElementById('txtServicioReferencia').value.trim().length === 0) ? null : document.getElementById('txtServicioReferencia').value);
        var observaciones = ((document.getElementById('txtObservaciones').value.trim().length === 0) ? null : document.getElementById('txtObservaciones').value);

        let entrada = {
            'punto_id': document.getElementById('punto_id').value,
            'operario_id': document.getElementById('operario_id').value,
            'hubo_consumo': document.getElementById('cboConsumo').value,
            'medida_inicial': document.getElementById('txtMedidaInicial').value,
            'medida': document.getElementById('txtMedidaActual').value,
            'recambio': document.getElementById('cboRecambio').value,
            'visita': visita,
            'observaciones': observaciones,
            'lat': geolat,
            'long': geolong
        };

        let datos = await fetch(http + '/qr/api_registrarConsumo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        document.getElementById('codigo_unico_registrado').innerHTML = resultado.datos[0].CODIGO_UNICO;

        document.getElementById('tabla_formulario_captura').style.display = 'none';
        document.getElementById('tabla_formulario_confirmacion_captura').style.display = 'none';
        document.getElementById('tabla_formulario_ok_captura').style.display = '';
    } catch (e) {
        console.log('captura', e);
        button_element.disabled = false;
    }

}

function obtenerCoordenadas() {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                    function (posicion) {
                        var latitud = posicion.coords.latitude;
                        var longitud = posicion.coords.longitude;

                        // Crear el objeto con latitud y longitud
                        var ubicacion = {
                            'lat': latitud,
                            'long': longitud
                        };

                        resolve(ubicacion);
                    },
                    function () {
                        // Si hay un error, devolver un objeto con lat y long como null
                        var ubicacionError = {
                            'lat': null,
                            'long': null
                        };
                        resolve(ubicacionError);
                    }
            );
        } else {
            // Si la geolocalización no es compatible, devolver un objeto con lat y long como null
            var ubicacionError = {
                'lat': null,
                'long': null
            };
            resolve(ubicacionError);
        }
    });
}

function consumo_o_no() {
    try {
        if (document.getElementById('formulario_captura')) {

            let hubo_consumo = document.getElementById('cboConsumo');
            let medidainicial = document.getElementById('txtMedidaInicial');
            let medidaactual = document.getElementById('txtMedidaActual');


            if (hubo_consumo.value == '1') {

                medidainicial.style.backgroundColor = 'var(--blanco)';
                medidainicial.style.border = "1px solid var(--negro)";

                medidaactual.style.backgroundColor = 'var(--blanco)';
                medidaactual.style.border = "1px solid var(--negro)";

                medidainicial.readOnly = false;
                medidaactual.readOnly = false;

            } else {
                medidainicial.value = '0';
                medidaactual.value = '0';

                medidainicial.style.backgroundColor = "#f0f0f0";
                medidainicial.style.border = "1px solid #ccc";

                medidaactual.style.backgroundColor = "#f0f0f0";
                medidaactual.style.border = "1px solid #ccc";

                medidainicial.readOnly = true;
                medidaactual.readOnly = true;
            }
        }
    } catch (e) {
        console.log('captura', e);
    }
}

function llenarInputsCoordenadas() {
    try {
        if (document.getElementById('formulario_captura')) {
            obtenerCoordenadas().then(ubicacion => {
                try {
                    // Obtener los inputs
                    var inputLatitud = document.getElementById('geo_lat');
                    var inputLongitud = document.getElementById('geo_long');

                    // Verificar si las coordenadas son válidas y asignar a los inputs
                    inputLatitud.value = ubicacion.lat;
                    inputLongitud.value = ubicacion.long;

                    // Opcional: Mostrar las coordenadas en la consola
                    //console.log("Latitud: " + ubicacion.lat + ", Longitud: " + ubicacion.long);
                } catch (e) {
                    console.log('captura (en promesa)', e);
                }
            });
        }
    } catch (e) {
        console.log('captura', e);
    }
}

/*esto parsea tildes en alerts y confirms desde entidades html */
function tildes(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}


document.addEventListener('DOMContentLoaded', function () {
    llenarInputsCoordenadas();
    consumo_o_no();
});