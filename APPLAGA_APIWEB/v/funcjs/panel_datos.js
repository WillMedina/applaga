let ram_clientes = [];
let ram_locales = [];
let ram_productos = [];
let ram_equipos = [];

async function cargar_locales() {
    try {
        //limpiar ram_locales
        ram_locales.splice(0, ram_locales.length);
        let select_clientes = document.getElementById('lista_clientes');
        if (select_clientes && select_clientes.value !== 0) {
            let entrada = {cliente_id: select_clientes.value};
            let datos = await fetch(http + '/cliente/api_listarlocales_admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entrada)
            });

            let resultado = await datos.json();
            let tabla_locales_contenidos = '';


            if (resultado.datos.length === 0) {
                tabla_locales_contenidos += '<tr>';
                tabla_locales_contenidos += '<td colspan="5" style="text-align:center">Este cliente no cuenta con locales registrados.</td>';
                tabla_locales_contenidos += '</tr>';
            }

            for (var i = 0; i < resultado.datos.length; i++) {
                var nombreclave = (resultado.datos[i].NOMBRECLAVE === null ? '' : '[' + resultado.datos[i].NOMBRECLAVE + '] ');
                tabla_locales_contenidos += '<tr>';
                tabla_locales_contenidos += '<td style="text-align:center">' + nombreclave + '' + resultado.datos[i].DIRECCION + '</td>';
                tabla_locales_contenidos += '<td style="text-align:center">' + resultado.datos[i].FRECUENCIA_SERVICIO + '</td>';
                tabla_locales_contenidos += '<td style="text-align:center">' + (resultado.datos[i].TELEFONO === null ? '' : resultado.datos[i].TELEFONO) + '</td>';
                tabla_locales_contenidos += '<td style="text-align:center">' + (resultado.datos[i].EMAIL === null ? '' : resultado.datos[i].EMAIL) + '</td>';
                tabla_locales_contenidos += '<td style="text-align:center">';
                tabla_locales_contenidos += '<button onclick="editar_local(' + resultado.datos[i].LOCAL_ID + ')"><i class="fas fa-edit"></i></button> ';
                tabla_locales_contenidos += '<button onclick="borrar_local(' + resultado.datos[i].LOCAL_ID + ')"><i class="fas fa-trash-alt"></i></button> ';
                tabla_locales_contenidos += '</td>';
                tabla_locales_contenidos += '</tr>';

                var ram_local = {
                    local_id: parseInt(resultado.datos[i].LOCAL_ID),
                    dir: resultado.datos[i].DIRECCION,
                    nc: resultado.datos[i].NOMBRECLAVE,
                    fs: resultado.datos[i].FRECUENCIA_SERVICIO,
                    tel: resultado.datos[i].TELEFONO,
                    em: resultado.datos[i].EMAIL
                };

                ram_locales.push(ram_local);
            }

            let resultado_html = '<form onsubmit="return false">'
                    + '<button onclick="registrar_local(' + select_clientes.value + ')"><i class="fas fa-plus-square"></i> Registrar nuevo local</button>'
                    + '<button onclick="cargar_locales()">Refrescar datos</button>'
                    + '</form><br>'
                    + '<table class="tabla-blanca tabla-sombra responsive espaciado">'
                    + '<tr>'
                    + '<th style="width:40%">Direcci&oacute;n</th>'
                    + '<th style="width:15%">Frecuencia de servicio</th>'
                    + '<th style="width:15%">Tel&eacute;fono</th>'
                    + '<th style="width:15%">Email</th>'
                    + '<th style="width:15%"><i class="fas fa-cogs"></i></th>'
                    + '</tr>'
                    + '<tbody id="contenido_locales">'
                    + tabla_locales_contenidos
                    + '</tbody>'
                    + '</table>';

            document.getElementById('resultados').innerHTML = '<span style="text-align:center">Cargando informaci&oacute;n...</span>';
            document.getElementById('resultados').innerHTML = resultado_html;
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function cargar_clientes_select() {
    try {
        let select_clientes = document.getElementById('lista_clientes');
        if (select_clientes) {
            let datos = await fetch(http + '/cliente/api_listarclientes_all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let resultado = await datos.json();
            for (var i = 0; i < resultado.datos.length; i++) {
                var option = document.createElement('option');
                option.value = resultado.datos[i].CLIENTE_ID;
                option.textContent = '[' + resultado.datos[i].NOMBRECLAVE + '] ' + resultado.datos[i].RAZONSOCIAL;
                select_clientes.appendChild(option);
            }
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

function editar_local(local_id) {
    try {
        let datos_local = buscar_local_ram(local_id);
        if (datos_local !== null) {
            document.getElementById('editar_local_localid').value = datos_local.local_id;
            document.getElementById('editar_local_nombreclave').value = datos_local.nc;
            document.getElementById('editar_local_direccion').value = datos_local.dir;
            document.getElementById('editar_local_telefono').value = datos_local.tel;
            document.getElementById('editar_local_email').value = datos_local.em;
            document.getElementById('editar_local_frecuencia').value = datos_local.fs;

            let modal = document.getElementById('modal_editar_local');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function editar_local_ok(button_element) {
    let modal = document.getElementById('modal_editar_local');
    try {
        button_element.disabled = true;

        let entrada = {
            local_id: document.getElementById('editar_local_localid').value,
            nombreclave: document.getElementById('editar_local_nombreclave').value,
            direccion: document.getElementById('editar_local_direccion').value,
            frecuencia_servicio: document.getElementById('editar_local_frecuencia').value,
            telefono: document.getElementById('editar_local_telefono').value,
            email: document.getElementById('editar_local_email').value
        };

        let datos = await fetch(http + '/cliente/api_editarlocal', {
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
        //to(http + '/panel/locales');
        cargar_locales();
    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

function borrar_local(local_id) {
    try {
        let datos_local = buscar_local_ram(local_id);
        if (datos_local !== null) {

            document.getElementById('borrar_local_localid').value = datos_local.local_id;
            document.getElementById('local_a_borrar').innerHTML = '[' + datos_local.nc + '] ' + datos_local.dir;
            let modal = document.getElementById('modal_borrar_local');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function borrar_local_ok(button_element) {
    let modal = document.getElementById('modal_borrar_local');
    try {
        button_element.disabled = true;

        let id = document.getElementById('borrar_local_localid').value;

        let entrada = {local_id: id};
        let datos = await fetch(http + '/cliente/api_borrarlocal', {
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
        //to(http + '/panel/locales');
        cargar_locales();
    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

async function borrar_producto_ok(button_element) {
    let modal = document.getElementById('modal_borrar_producto');
    try {
        button_element.disabled = true;

        let id = document.getElementById('borrar_producto_id').value;

        let entrada = {producto_id: id};
        let datos = await fetch(http + '/servicio/api_borrarProducto', {
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
        //to(http + '/panel/productos');
        cargar_productos();

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

function cancelar_borrado_local(button_element) {
    button_element.disabled = true;
    let modal = document.getElementById('modal_borrar_local');
    cerrar_modal(modal);
    button_element.disabled = false;
    //por si acaso
    document.getElementById('borrar_local_localid').value = 0;
}

function cancelar_borrado_producto(button_element) {
    button_element.disabled = true;
    let modal = document.getElementById('modal_borrar_producto');
    cerrar_modal(modal);
    button_element.disabled = false;
    //por si acaso
    document.getElementById('borrar_producto_id').value = 0;
}

function cancelar_borrado_equipo(button_element) {
    button_element.disabled = true;
    let modal = document.getElementById('modal_borrar_equipo');
    cerrar_modal(modal);
    button_element.disabled = false;
    //por si acaso
    document.getElementById('borrar_equipo_id').value = 0;
}

function registrar_local(cliente_id) {
    document.getElementById('registrar_local_clienteid').value = cliente_id;
    let modal = document.getElementById('modal_registrar_local');
    try {
        invocar_modal(modal);
    } catch (e) {
        console.log("panel_datos", e);
    }
}

async function registrar_local_ok(button_element) {
    let modal = document.getElementById('modal_registrar_local');
    try {
        button_element.disabled = true;

        let entrada = {
            cliente_id: document.getElementById('registrar_local_clienteid').value,
            nombreclave: document.getElementById('registrar_local_nombreclave').value,
            direccion: document.getElementById('registrar_local_direccion').value,
            frecuencia_servicio: document.getElementById('registrar_local_frecuencia').value,
            telefono: document.getElementById('registrar_local_telefono').value,
            email: document.getElementById('registrar_local_email').value
        };

        let datos = await fetch(http + '/cliente/api_registrarlocal', {
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
        //to(http + '/panel/locales');
        cargar_locales();

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

function registrar_producto() {
    let modal = document.getElementById("modal_registrar_producto");
    try {
        invocar_modal(modal);
    } catch (e) {
        console.log("panel_datos", e);
    }

}

async function registrar_producto_ok(button_element) {
    let modal = document.getElementById('modal_registrar_producto');
    try {
        button_element.disabled = true;

        let entrada = {
            nombre: document.getElementById('registrar_producto_nombre').value,
            nombrecomercial: document.getElementById('registrar_producto_nombrecomercial').value,
            ingredienteactivo: document.getElementById('registrar_producto_ingredienteactivo').value,
            descripcion: document.getElementById('registrar_producto_descripcion').value,
            fichatecnica: document.getElementById('registrar_producto_fichatecnica').value
        };

        let datos = await fetch(http + '/servicio/api_registrarProducto', {
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
        //to(http + '/panel/productos');
        cargar_productos();

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }

}

function buscar_producto_ram(id) {
    let objetoEncontrado = null;

    for (let i = 0; i < ram_productos.length; i++) {
        if (ram_productos[i].id === id) {
            objetoEncontrado = ram_productos[i];
            break;  // Salir del bucle una vez que se encuentra el objeto deseado
        }
    }

    return objetoEncontrado;
}

function editar_producto(producto_id) {
    try {
        let datos_producto = buscar_producto_ram(producto_id);
        if (datos_producto !== null) {
            document.getElementById('editar_producto_id').value = datos_producto.id;
            document.getElementById('editar_producto_nombre').value = datos_producto.no;
            document.getElementById('editar_producto_nombrecomercial').value = datos_producto.nc;
            document.getElementById('editar_producto_ingredienteactivo').value = datos_producto.ia;
            document.getElementById('editar_producto_descripcion').value = datos_producto.des;
            document.getElementById('editar_producto_fichatecnica').value = datos_producto.ft;

            let modal = document.getElementById('modal_editar_producto');
            invocar_modal(modal);

        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function editar_producto_ok(button_element) {
    let modal = document.getElementById('modal_editar_producto');
    try {
        button_element.disabled = true;
        let entrada = {
            id: document.getElementById('editar_producto_id').value,
            nombre: document.getElementById('editar_producto_nombre').value,
            nombrecomercial: document.getElementById('editar_producto_nombrecomercial').value,
            ingredienteactivo: document.getElementById('editar_producto_ingredienteactivo').value,
            descripcion: document.getElementById('editar_producto_descripcion').value,
            fichatecnica: document.getElementById('editar_producto_fichatecnica').value
        };

        let datos = await fetch(http + '/servicio/api_editarProducto', {
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
        //to(http + '/panel/productos');
        cargar_productos();
    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

function borrar_producto(producto_id) {
    try {
        let datos_producto = buscar_producto_ram(producto_id);
        if (datos_producto !== null) {

            document.getElementById('borrar_producto_id').value = datos_producto.id;
            var nombrecomercial = ((datos_producto.nc === null) ? '' : ' [' + datos_producto.nc + ']');
            var ingredienteactivo = ((datos_producto.ia === null) ? '' : ' [' + datos_producto.ia + ']');

            document.getElementById('producto_a_borrar').innerHTML = datos_producto.no + nombrecomercial + ingredienteactivo;
            let modal = document.getElementById('modal_borrar_producto');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function cargar_clientes() {
    try {
        let tbody_clientes = document.getElementById("tbody_listado_clientes");
        if (tbody_clientes) {
            let contenido = '';
            tbody_clientes.innerHTML = '<tr><td colspan="4" style="text-align:center">' +
                    '<i class="fas fa-spinner fa-spin"></i> Cargando informaci&oacute;n...</td></tr>';
            let datos = await fetch(http + '/cliente/api_listarclientes_all',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
            );

            let resultado = await datos.json();

            for (var i = 0; i < resultado.datos.length; i++) {
                contenido += '<tr>';
                contenido += '<td style="text-align:center">' + resultado.datos[i].NOMBRECLAVE + '</td>';
                contenido += '<td style="text-align:center">' + resultado.datos[i].RAZONSOCIAL + '</td>';
                contenido += '<td style="text-align:center">' + resultado.datos[i].RUC + '</td>';
                contenido += '<td style="text-align:center">';
                contenido += '<button onclick="editar_cliente(' + resultado.datos[i].CLIENTE_ID + ')"><i class="fas fa-edit"></i></button> ';
                contenido += '<button onclick="borrar_cliente(' + resultado.datos[i].CLIENTE_ID + ')"><i class="fas fa-trash-alt"></i></button> ';
                contenido += '</td>';
                contenido += '</tr>';

                var ram_cliente = {
                    id: parseInt(resultado.datos[i].CLIENTE_ID),
                    nc: resultado.datos[i].NOMBRECLAVE,
                    rs: resultado.datos[i].RAZONSOCIAL,
                    ruc: resultado.datos[i].RUC
                };

                ram_clientes.push(ram_cliente);
            }

            tbody_clientes.innerHTML = contenido;
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

function buscar_local_ram(id) {
    let objetoEncontrado = null;

    for (let i = 0; i < ram_locales.length; i++) {
        if (ram_locales[i].local_id === id) {
            objetoEncontrado = ram_locales[i];
            break;  // Salir del bucle una vez que se encuentra el objeto deseado
        }
    }

    return objetoEncontrado;
}

function buscar_cliente_ram(id) {
    let objetoEncontrado = null;

    for (let i = 0; i < ram_clientes.length; i++) {
        if (ram_clientes[i].id === id) {
            objetoEncontrado = ram_clientes[i];
            break;  // Salir del bucle una vez que se encuentra el objeto deseado
        }
    }

    return objetoEncontrado;
}

function editar_cliente(cliente_id) {
    try {
        let datos_cliente = buscar_cliente_ram(cliente_id);
        if (datos_cliente !== null) {

            document.getElementById('editar_cliente_clienteid').value = datos_cliente.id;
            document.getElementById('editar_cliente_nombreclave').value = datos_cliente.nc;
            document.getElementById('editar_cliente_razonsocial').value = datos_cliente.rs;
            document.getElementById('editar_cliente_ruc').value = datos_cliente.ruc;

            let modal = document.getElementById('modal_editar_cliente');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function editar_cliente_ok(button_element) {
    //en teoria este modal debe estar abierto
    let modal = document.getElementById('modal_editar_cliente');
    try {
        let button = button_element;

        button.disabled = true;

        let id = document.getElementById('editar_cliente_clienteid').value;
        let nc = document.getElementById('editar_cliente_nombreclave').value;
        let rs = document.getElementById('editar_cliente_razonsocial').value;
        let ruc = document.getElementById('editar_cliente_ruc').value;

        let entrada = {cliente_id: id, nombreclave: nc, razonsocial: rs, ruc: ruc};
        let datos = await fetch(http + '/cliente/api_editarcliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        alert(resultado.datos[0].mensaje);
        cerrar_modal(modal);
        button.disabled = false;
        //to(http + '/panel/clientes');
        cargar_clientes();
    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button.disabled = false;
    }
}

function borrar_cliente(cliente_id) {
    try {
        let datos_cliente = buscar_cliente_ram(cliente_id);
        if (datos_cliente !== null) {

            document.getElementById('borrar_cliente_clienteid').value = datos_cliente.id;
            document.getElementById('cliente_a_borrar').innerHTML = '[' + datos_cliente.nc + '] ' + datos_cliente.rs;
            let modal = document.getElementById('modal_borrar_cliente');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function borrar_cliente_ok(button_element) {
//en teoria este modal debe estar abierto
    let modal = document.getElementById('modal_borrar_cliente');
    try {
        button_element.disabled = true;

        let id = document.getElementById('borrar_cliente_clienteid').value;

        let entrada = {cliente_id: id};
        let datos = await fetch(http + '/cliente/api_borrarcliente', {
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
        //to(http + '/panel/clientes');
        cargar_clientes();

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

function cancelar_borrado(button_element) {
    button_element.disabled = true;
    let modal = document.getElementById('modal_borrar_cliente');
    cerrar_modal(modal);
    button_element.disabled = false;
    //por si acaso
    document.getElementById('borrar_cliente_clienteid').value = 0;
}

function registrar_cliente() {
    let modal = document.getElementById('modal_registrar_cliente');
    try {
        invocar_modal(modal);
    } catch (e) {
        console.log("panel_datos", e);
    }
}

async function registrar_cliente_ok(button_element) {
    //en teoria este modal debe estar abierto
    let modal = document.getElementById('modal_registrar_cliente');
    try {
        let button = button_element;

        button.disabled = true;

        let nc = document.getElementById('registrar_cliente_nombreclave').value;
        let rs = document.getElementById('registrar_cliente_razonsocial').value;
        let ruc = document.getElementById('registrar_cliente_ruc').value;

        let entrada = {nombreclave: nc, razonsocial: rs, ruc: ruc};
        let datos = await fetch(http + '/cliente/api_registrarcliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();

        alert(resultado.datos[0].mensaje);
        cerrar_modal(modal);
        button.disabled = false;
        //to(http + '/panel/clientes');
        cargar_clientes();
    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button.disabled = false;
    }
}

async function cargar_productos() {
    try {
        let tbody_productos = document.getElementById("tbody_listado_productos");
        if (tbody_productos) {
            let contenido = '';
            tbody_productos.innerHTML = '<tr><td colspan="6" style="text-align:center">' +
                    '<i class="fas fa-spinner fa-spin"></i> Cargando informaci&oacute;n...</td></tr>';
            let datos = await fetch(http + '/servicio/api_listarproductos',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
            );

            let resultado = await datos.json();

            for (var i = 0; i < resultado.datos.length; i++) {
                contenido += '<tr>';
                contenido += '<td style="text-align:center">' + resultado.datos[i].NOMBRE + '</td>';
                contenido += '<td style="text-align:center" class="solo-desktop">' + posnull(resultado.datos[i].NOMBRECOMERCIAL) + '</td>';
                contenido += '<td style="text-align:center">' + posnull(resultado.datos[i].INGREDIENTEACTIVO) + '</td>';
                contenido += '<td style="text-align:center">' + posnull(resultado.datos[i].FICHATECNICA) + '</td>';
                contenido += '<td style="text-align:center" class="solo-desktop">' + posnull(resultado.datos[i].DESCRIPCION) + '</td>';
                contenido += '<td style="text-align:center">';
                contenido += '<button onclick="editar_producto(' + resultado.datos[i].PRODUCTO_ID + ')"><i class="fas fa-edit"></i></button> ';
                contenido += '<button onclick="borrar_producto(' + resultado.datos[i].PRODUCTO_ID + ')"><i class="fas fa-trash-alt"></i></button> ';
                contenido += '</td>';
                contenido += '</tr>';

                var ram_producto = {
                    id: parseInt(resultado.datos[i].PRODUCTO_ID),
                    no: resultado.datos[i].NOMBRE,
                    nc: resultado.datos[i].NOMBRECOMERCIAL,
                    ia: resultado.datos[i].INGREDIENTEACTIVO,
                    ft: resultado.datos[i].FICHATECNICA,
                    des: resultado.datos[i].DESCRIPCION
                };

                ram_productos.push(ram_producto);
            }

            tbody_productos.innerHTML = contenido;
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function cargar_equipos() {
    try {
        let tbody_equipos = document.getElementById("tbody_listado_equipos");
        if (tbody_equipos) {
            let contenido = '';
            tbody_equipos.innerHTML = '<tr><td colspan="6" style="text-align:center">' +
                    '<i class="fas fa-spinner fa-spin"></i> Cargando informaci&oacute;n...</td></tr>';
            let datos = await fetch(http + '/servicio/api_listarequipos',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
            );

            let resultado = await datos.json();

            for (var i = 0; i < resultado.datos.length; i++) {
                contenido += '<tr>';
                contenido += '<td style="text-align:center">' + resultado.datos[i].NOMBRE + '</td>';
                contenido += '<td style="text-align:center" class="solo-desktop">' + posnull(resultado.datos[i].FICHATECNICA) + '</td>';
                contenido += '<td style="text-align:center">' + posnull(resultado.datos[i].DESCRIPCION) + '</td>';

                contenido += '<td style="text-align:center">';
                contenido += '<button onclick="editar_equipo(' + resultado.datos[i].EQUIPO_ID + ')"><i class="fas fa-edit"></i></button> ';
                contenido += '<button onclick="borrar_equipo(' + resultado.datos[i].EQUIPO_ID + ')"><i class="fas fa-trash-alt"></i></button> ';
                contenido += '</td>';
                contenido += '</tr>';

                var ram_equipo = {
                    id: parseInt(resultado.datos[i].EQUIPO_ID),
                    no: resultado.datos[i].NOMBRE,
                    ft: resultado.datos[i].FICHATECNICA,
                    des: resultado.datos[i].DESCRIPCION
                };

                ram_equipos.push(ram_equipo);
            }

            tbody_equipos.innerHTML = contenido;
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

function registrar_equipo() {
    let modal = document.getElementById('modal_registrar_equipo');
    try {
        invocar_modal(modal);
    } catch (e) {
        console.log("panel_datos", e);
    }
}

async function registrar_equipo_ok(button_element) {
    let modal = document.getElementById("modal_registrar_equipo");
    try {
        button_element.disabled = true;

        let entrada = {
            nombre: document.getElementById('registrar_equipo_nombre').value,
            descripcion: document.getElementById('registrar_equipo_descripcion').value,
            fichatecnica: document.getElementById('registrar_equipo_fichatecnica').value
        };

        let datos = await fetch(http + '/servicio/api_registrarEquipo', {
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

        cargar_equipos();

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }

}

function buscar_equipo_ram(id) {
    let objetoEncontrado = null;

    for (let i = 0; i < ram_equipos.length; i++) {
        if (ram_equipos[i].id === id) {
            objetoEncontrado = ram_equipos[i];
            break;  // Salir del bucle una vez que se encuentra el objeto deseado
        }
    }

    return objetoEncontrado;
}

function editar_equipo(equipo_id) {
    try {
        let datos_equipo = buscar_equipo_ram(equipo_id);
        if (datos_equipo !== null) {
            document.getElementById('editar_equipo_id').value = datos_equipo.id;
            document.getElementById('editar_equipo_nombre').value = datos_equipo.no;
            document.getElementById('editar_equipo_descripcion').value = datos_equipo.des;
            document.getElementById('editar_equipo_fichatecnica').value = datos_equipo.ft;

            let modal = document.getElementById('modal_editar_equipo');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function editar_equipo_ok(button_element) {
    let modal = document.getElementById('modal_editar_equipo');
    try {
        button_element.disabled = true;
        let entrada = {
            id: document.getElementById('editar_equipo_id').value,
            nombre: document.getElementById('editar_equipo_nombre').value,
            descripcion: document.getElementById('editar_equipo_descripcion').value,
            fichatecnica: document.getElementById('editar_equipo_fichatecnica').value
        };

        let datos = await fetch(http + '/servicio/api_editarEquipo', {
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
        //to(http + '/panel/productos');
        cargar_equipos();
    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
    }
}

function borrar_equipo(equipo_id){
    try {
        let datos_equipo = buscar_equipo_ram(equipo_id);
        if (datos_equipo !== null) {

            document.getElementById('borrar_equipo_id').value = datos_equipo.id;
            document.getElementById('equipo_a_borrar').innerHTML = datos_equipo.no;
            let modal = document.getElementById('modal_borrar_equipo');
            invocar_modal(modal);
        }
    } catch (e) {
        console.log('panel_datos', e);
    }
}

async function borrar_equipo_ok(button_element) {
    let modal = document.getElementById('modal_borrar_equipo');
    try {
        button_element.disabled = true;

        let id = document.getElementById('borrar_equipo_id').value;

        let entrada = {equipo_id: id};
        let datos = await fetch(http + '/servicio/api_borrarEquipo', {
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
        //to(http + '/panel/productos');
        cargar_equipos();

    } catch (e) {
        cerrar_modal(modal);
        console.log('panel_datos', e);
        button_element.disabled = false;
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