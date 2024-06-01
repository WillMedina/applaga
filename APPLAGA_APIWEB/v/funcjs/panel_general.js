var modal_abierto = false;
function salir() {
    if (confirm("Está seguro que desea salir?")) {
        to(http + "/login/c_logout");
    }
}

function to(url) {
    window.location.href = url;
}

function to_new(url) {
    window.open(url, '_blank');
}

function mysql_to_dtl(mysql) {
    try {
        // Expresión regular para el formato YYYY-MM-DD HH:mm:ss
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (regex.test(mysql)) {
            const date = new Date(mysql);

            // Extraer los componentes de fecha y hora
            const day = date.getDate();
            const month = date.getMonth() + 1; // Los meses en JavaScript son base 0
            const year = date.getFullYear();
            let hours = date.getHours();
            const minutes = date.getMinutes();

            // Determinar si es AM o PM
            const amOrPm = hours >= 12 ? 'PM' : 'AM';

            // Convertir a formato de 12 horas
            hours %= 12;
            hours = hours || 12; // Si hours es 0, asigna 12 en su lugar

            // Formatear los componentes según el formato deseado
            const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            // Concatenar los componentes formateados con la marca de AM o PM
            const formattedDateTime = `${formattedDate} ${formattedTime} ${amOrPm}`;

            return formattedDateTime;


            /*// Ejemplo de uso
             const mysqlDateTime = '2023-05-09 10:00:00';
             const formattedDateTime = convertDateTimeToCustomFormat(mysqlDateTime);
             console.log(formattedDateTime); // Resultado: '09-05-2023 10:00 AM'*/
        } else {
            console.log("Cadena ingresada para conversion desde MYSQL con formato incorrecto cadena:[" + mysql + ']');
            return '';
        }
    } catch (e) {
        console.log('panel_general', e);
        return '';
    }
}

function dtl_to_mysql(dtl) {
    try {
        // Obtener el valor datetime-local
        const datetimeLocal = dtl;

        // Dividir la fecha y hora
        const parts = datetimeLocal.split('T');

        // Obtener la fecha y la hora por separado
        const date = parts[0];
        const time = parts[1];

        // Formatear la fecha
        const dateParts = date.split('-');
        const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;

        // Formatear la hora
        const timeParts = time.split(':');
        const formattedTime = `${timeParts[0]}:${timeParts[1]}:00`;

        // Combinar la fecha y la hora
        const formattedDateTime = `${formattedDate} ${formattedTime}`;

        // Utilizar formattedDateTime en tu lógica o enviarlo al servidor
        return formattedDateTime;

    } catch (e) {
        console.log('panel_general', e);
        return null;
    }
}

function invocar_modal(modal_element) {
    modal_element.style.display = "block";
    modal_abierto = true;
}

function cerrar_modal(modal_element) {
    modal_element.style.display = "none";
    modal_abierto = false;
}

function extension_icon(extension) {
    return '<img src="' + http + '/v/img/' + extension.toLowerCase() + '.png" alt="">';
}

function ejecutar_funcion(funcion) {
    try {
        funcion();
    } catch (e) {
        console.log(e);
    }

}

function rangofechas_buscador() {
    // Obtener la fecha actual
    try {
        if (document.getElementById('fecha1')) {
            let today = new Date();
            //let oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            let oneMonthAgo = new Date(today.getFullYear(), 0, 1);

            let inputFechaInicio = document.getElementById('fecha1');
            inputFechaInicio.value = oneMonthAgo.toISOString().substr(0, 10);

            let inputFechaFin = document.getElementById('fecha2');
            inputFechaFin.value = today.toISOString().substr(0, 10);
        }
    } catch (e) {
        console.log(e);
    }
}

function ver_servicio_filtrar(tipo) {
    try {
        var divs = document.querySelectorAll('div[id^="show_"]');
        // Si se selecciona "Mostrar Todos", mostramos todos los divs
        if (tipo === 'all') {
            divs.forEach(function (div) {
                div.style.display = 'block';
            });
        } else {
            // Ocultamos todos los divs y mostramos solo el seleccionado
            divs.forEach(function (div) {
                div.style.display = 'none';
            });

            var selectedDiv = document.getElementById(tipo);
            if (selectedDiv) {
                selectedDiv.style.display = 'block';
            }
        }
    } catch (e) {
        console.log('panel_servicio', e);
    }

}

function mes(numero) {
    try {
        if (numero > 0 && numero < 13) {
            if (typeof numero === 'string') {
                numero = parseInt(numero, 10); // El segundo argumento es la base (10 para decimal)
            }

            let meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'];
            return meses[numero - 1];
        } else {
            return "";
        }
    } catch (e) {
        console.log('panel_general', e);
        return "";
    }
}

function serv_pc(button) {
    try {
        button.disabled = true;
        to(http + '/panel/servicio_pc/' + visita_codigo_unico);
        button.disabled = false;
    } catch (e) {
        console.log('panel_servicio', e);
        button.disabled = true;
    }
}

function galeria(button) {
    try {
        button.disabled = true;
        to(http + '/panel/servicio_fotos/' + visita_codigo_unico);
        button.disabled = false;
    } catch (e) {
        console.log('panel_servicio', e);
        button.disabled = true;
    }
}

function documentacion(button) {
    try {
        button.disabled = true;
        to(http + '/panel/servicio_documentos/' + visita_codigo_unico);
        button.disabled = false;
    } catch (e) {
        console.log('panel_servicio', e);
        button.disabled = true;
    }
}

function ver_visita(visita_id) {
    to(http + "/panel/servicio/" + visita_id);
}

/*esto parsea tildes en alerts y confirms desde entidades html */
function tildes(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

document.addEventListener('DOMContentLoaded', function () {
    try {
        var menuMobile = document.getElementById("menu-mobile");
        var burgerButton = document.querySelector(".burger-button");

        //cerrar modales con clic afuera
        window.addEventListener('click', function (event) {
            var modales = document.getElementsByClassName('modal');
            if (modal_abierto) {
                for (var i = 0; i < modales.length; i++) {
                    if (event.target == modales[i]) {
                        modales[i].style.display = 'none';
                    }
                }
            }
        });

        /* Solo para movil, que pueda abrir y cerrar el menu */
        burgerButton.addEventListener("click", function () {
            menuMobile.classList.toggle("menu-mobile-hidden");
        });

        /* Si da clic en cualquier otro lado, cierra el menu movil */
        document.addEventListener('click', function (event) {
            if (!menuMobile.contains(event.target) && !burgerButton.contains(event.target)) {
                menuMobile.classList.add('menu-mobile-hidden');
            }
        });

        //funciones de distintos archivos
        //ejecutar_funcion(rangofechas_buscador);
        let no_cargados = [];

        (typeof rangofechas_buscador === 'function') ? ejecutar_funcion(rangofechas_buscador) : no_cargados.push('rangofechas_buscador');
        (typeof llenarClientes === 'function') ? ejecutar_funcion(llenarClientes) : no_cargados.push('llenarClientes');
        (typeof cliente_llenar_locales === 'function') ? ejecutar_funcion(cliente_llenar_locales) : no_cargados.push('cliente_llenar_locales');
        (typeof cargar_qr === 'function') ? ejecutar_funcion(cargar_qr) : no_cargados.push('cargar_qr');
        (typeof cargar_clientes === 'function') ? ejecutar_funcion(cargar_clientes) : no_cargados.push('cargar_clientes');
        (typeof cargar_productos === 'function') ? ejecutar_funcion(cargar_productos) : no_cargados.push('cargar_productos');
        (typeof cargar_equipos === 'function') ? ejecutar_funcion(cargar_equipos) : no_cargados.push('cargar_equipos');
        (typeof cargar_clientes_select === 'function') ? ejecutar_funcion(cargar_clientes_select) : no_cargados.push('cargar_clientes_select');
        (typeof llenar_datos_edicion === 'function') ? ejecutar_funcion(llenar_datos_edicion) : no_cargados.push('llenar_datos_edicion');
        (typeof llenar_listado_documentos === 'function') ? ejecutar_funcion(llenar_listado_documentos) : no_cargados.push('llenar_listado_documentos');
        (typeof llenar_listado_fotos === 'function') ? ejecutar_funcion(llenar_listado_fotos) : no_cargados.push('llenar_listado_fotos');
        (typeof data_ceb === 'function') ? ejecutar_funcion(data_ceb) : no_cargados.push('data_ceb');

        console.log('No Cargados', no_cargados);

    } catch (e) {
        console.log(e);
    }
});