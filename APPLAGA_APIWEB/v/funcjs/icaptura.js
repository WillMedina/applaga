function cerrar_sesion() {
    salir();
}

function salir() {
    if (confirm("Está seguro que desea salir?")) {
        to(http + "/login/c_logout");
    }
}

function to(url) {
    window.location.href = url;
}

async function iniciar_sesion() {
    let u = document.getElementById('txtUsuario').value;
    let p = document.getElementById('txtPass').value;
    let codigo_unico = document.getElementById('codigo_unico').value

    if (u.length === 0 || p.length === 0) {
        alert("Debe llenar los campos para poder autenticarse");
        document.getElementById('txtUsuario').focus();
    } else {
        const datos = {usuario: u, pass: p};
        const respuesta = await fetch(http + '/login/c_login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (resultado.resultado == "1") {
            to(http + "/qr/icaptura/" + codigo_unico);
            return;
        }

        alert(resultado.mensaje);
    }
}

function registrar_consumo(button_element) {
    try {
        button_element.disabled = true;
        var pre_ref = (document.getElementById('txtServicioReferencia').value.trim().length === 0 ? '<i>Sin servicio de referencia</i>' : document.getElementById('txtServicioReferencia').value);
        var pre_obs = (document.getElementById('txtObservaciones').value.trim().length === 0 ? '<i>No se registran observaciones</i>' : document.getElementById('txtObservaciones').value);
        var pre_recambio = (document.getElementById('cboRecambio').value == '0' ? 'NO' : 'SI');

        document.getElementById('span_deterioro').innerHTML = document.getElementById('cboDeterioro').value;
        document.getElementById('span_recambio').innerHTML = pre_recambio;
        document.getElementById('span_lepidopteros').innerHTML = document.getElementById('lepidopteros').value;
        document.getElementById('span_microlepidopteros').innerHTML = document.getElementById('microlepidopteros').value;
        document.getElementById('span_hemipteros').innerHTML = document.getElementById('hemipteros').value;
        document.getElementById('span_coleopteros').innerHTML = document.getElementById('coleopteros').value;
        document.getElementById('span_moscas').innerHTML = document.getElementById('moscas').value;
        document.getElementById('span_mosquitos').innerHTML = document.getElementById('mosquitos').value;
        document.getElementById('span_otros').innerHTML = document.getElementById('otros').value;
        document.getElementById('span_referencia').innerHTML = pre_ref;
        document.getElementById('span_observaciones').innerHTML = pre_obs;

        document.getElementById('tabla_formulario_captura').style.display = 'none';
        document.getElementById('tabla_formulario_confirmacion_captura').style.display = '';
        button_element.disabled = false;
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
            'deterioro': document.getElementById('cboDeterioro').value,
            'recambio': document.getElementById('cboRecambio').value,
            'lepidopteros': document.getElementById('lepidopteros').value,
            'microlepidopteros': document.getElementById('microlepidopteros').value,
            'hemipteros': document.getElementById('hemipteros').value,
            'coleopteros': document.getElementById('coleopteros').value,
            'moscas': document.getElementById('moscas').value,
            'mosquitos': document.getElementById('mosquitos').value,
            'otros': document.getElementById('otros').value,
            'visita': visita,
            'observaciones': observaciones,
            'lat': geolat,
            'long': geolong
        };

        let datos = await fetch(http + '/qr/api_registrarConsumoInsectos', {
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


function cancelar_consumo_ok(button_element) {
    try {
        button_element.disabled = true;
        document.getElementById('tabla_formulario_captura').style.display = '';
        document.getElementById('tabla_formulario_confirmacion_captura').style.display = 'none';

        document.getElementById('span_deterioro').innerHTML = '';
        document.getElementById('span_recambio').innerHTML = '';
        document.getElementById('span_lepidopteros').innerHTML = '';
        document.getElementById('span_microlepidopteros').innerHTML = '';
        document.getElementById('span_hemipteros').innerHTML = '';
        document.getElementById('span_coleopteros').innerHTML = '';
        document.getElementById('span_moscas').innerHTML = '';
        document.getElementById('span_mosquitos').innerHTML = '';
        document.getElementById('span_otros').innerHTML = '';
        document.getElementById('span_referencia').innerHTML = '';
        document.getElementById('span_observaciones').innerHTML = '';
        button_element.disabled = false;
    } catch (e) {
        console.log('icaptura', e);
        button_element.disabled = false;
    }

}

document.addEventListener('DOMContentLoaded', function () {
    llenarInputsCoordenadas();
});
