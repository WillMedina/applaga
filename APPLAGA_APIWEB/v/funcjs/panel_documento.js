async function listarDocumentos() {

    try {
        let n_constancia = document.getElementById('txtNConstancia');
        let codigo_unico = document.getElementById('txtCodigoUnico');

        n_constancia.classList.remove('input-alerta');
        codigo_unico.classList.remove('input-alerta');

        if (n_constancia.value.trim().length === 0 && codigo_unico.value.trim().length === 0) {
            n_constancia.classList.add('input-alerta');
            codigo_unico.classList.add('input-alerta');
            return false;
        }

        let div_resultados = document.getElementById('resultado_lista');
        div_resultados.innerHTML = '<div>Cargando ...<i class="fas fa-spinner fa-spin"></i></div>';

        let entrada = {n_constancia: n_constancia.value, codigo_unico: codigo_unico.value};
        let datos = await fetch(http + '/documento/api_listardocumentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();
        let resultado_final = '<form onsubmit="return false">';

        resultado_final += '<table class="responsive">';
        resultado_final += '<tr>';
        resultado_final += '<th style="width:10%">ID</th>';
        resultado_final += '<th class="solo-desktop" style="width:10%">C&Oacute;DIGO &Uacute;NICO</th>';
        resultado_final += '<th class="solo-desktop" style="width:10%">REEMPLAZA A</th>';
        resultado_final += '<th style="width:10%">EXTENSI&Oacute;N</th>';
        resultado_final += '<th style="width:10%">CREACI&Oacute;N</th>';
        resultado_final += '<th style="width:10%">NOMBRE</th>';
        resultado_final += '<th class="solo-desktop" style="width:10%">AUTOR</th>';
        resultado_final += '<th class="solo-desktop" style="width:10%">PUBLICADO</th>';
        resultado_final += '<th style="width:10%">VISTO</th>';
        resultado_final += '<th style="width:10%"><i class="fas fa-cogs"></i></th>';
        resultado_final += '</tr>';

        console.log(resultado);

        if (resultado.datos[0].resultado == 0) {
            resultado_final += '<tr>';
            resultado_final += '<td colspan="10" style="padding: 3px" class="td_center">';
            resultado_final += '<i class="fas fa-exclamation-triangle"></i> ' + resultado.datos[0].mensaje;
            resultado_final += '</td>';
            resultado_final += '</tr>';
        } else {

            for (var i = 0; i < resultado.datos.length; i++) {
                resultado_final += '<tr>';
                resultado_final += '<td class="td_center">' + resultado.datos[i].VISITA_DOCUMENTO_ID + '</td>';
                resultado_final += '<td class="solo-desktop td_center "><code>' + resultado.datos[i].CODIGO_UNICO_DOCUMENTO + '</code></td>';
                resultado_final += '<td class="solo-desktop td_center">' + ((resultado.datos[i].REEMPLAZA_A == null) ? 'NO REEMPLAZA' : resultado.datos[i].REEMPLAZA_A) + '</td>';
                resultado_final += '<td class="td_center">' + extension_icon(resultado.datos[i].EXTENSION) + '</td>';
                resultado_final += '<td class="td_center">' + mysql_to_dtl(resultado.datos[i].FECHA_CREACION) + '</td>';
                resultado_final += '<td class="td_center">' + resultado.datos[i].NOMBRE + '</td>';
                resultado_final += '<td class="solo-desktop td_center">' + resultado.datos[i].AUTOR + '</td>';
                resultado_final += '<td class="solo-desktop td_center">' + ((resultado.datos[i].PUBLICADO_CLIENTE == 0) ? 'NO' : 'SI') + '</td>';
                resultado_final += '<td class="td_center">' + ((resultado.datos[i].RECIBIDO_CLIENTE == 0) ? 'NO' : 'SI') + '</td>';
                resultado_final += '<td class="td_center"><button onclick="ver_documento(' + resultado.datos[i].VISITA_DOCUMENTO_ID + ', this)"><i class="fas fa-eye"></i> Ver</button></td>';
                resultado_final += '</tr>';
            }
        }

        /*
         if (resultado.datos.length == "0") {
         resultado_final += '<tr>';
         resultado_final += '<td colspan="10" style="padding: 3px" class="td_center">';
         resultado_final += '<i class="fas fa-exclamation-triangle"></i> No se han encontrado documentos en este servicio.';
         resultado_final += '</td>';
         resultado_final += '</tr>';
         }*/

        resultado_final += '<table>';
        resultado_final += '</form>';

        div_resultados.innerHTML = resultado_final;

    } catch (e) {
        console.log('panel_documento', e);
    }

}

function modal_subir() {
    let modal = document.getElementById('modal_subir_documento');
    invocar_modal(modal);
}

async function ver_documento(id, button_element) {
    try {
        let documento_id = id;
        let button = button_element; //boton que disparo el evento
        button.disabled = true; //seguridad del dom o de no dar varios disparos
        let ver_doc = document.getElementById('modal_ver_datos_documento');

        /*AQUI TRAER LA DATA DEL DOCUMENTO A FULL*/
        let resultados = await obtener_documento_raw(documento_id);
        console.log(resultados);
        document.getElementById('modal_codigo_unico').innerHTML = '<small>' + resultados.datos[0].CODIGO_UNICO_DOCUMENTO + '</small>';
        document.getElementById('nombre_documento').innerHTML = '<small>' + resultados.datos[0].NOMBRE + '</small>';
        document.getElementById('autor_documento').innerHTML = '<small>' + resultados.datos[0].AUTOR + '</small>';
        document.getElementById('descripcion_documento').innerHTML = (resultados.datos[0].DESCRIPCION === null ? '<small><i>NO INGRESADA</i></small>' : '<small>' + resultados.datos[0].DESCRIPCION + '</small>');
        document.getElementById('ruta_documento').innerHTML = '<code><small>' + resultados.datos[0].RUTA_DOCUMENTO + '</small></code>';
        document.getElementById('extension_documento').innerHTML = extension_icon(resultados.datos[0].EXTENSION);
        document.getElementById('codigo_unico_documento').innerHTML = resultados.datos[0].CODIGO_UNICO_DOCUMENTO + '</small>';
        document.getElementById('cliente_documento').innerHTML = '<small>[' + resultados.datos[0].CLIENTE_NOMBRECLAVE + '] ' + resultados.datos[0].CLIENTE_RAZONSOCIAL + '</small>';
        document.getElementById('direccion_documento').innerHTML = '<small>' + resultados.datos[0].LOCAL_DIRECCION + '</small>';
        document.getElementById('reemplaza_documento').innerHTML = (resultados.datos[0].REEMPLAZA_A === null) ? '<small><i>NO REEMPLAZA</i></small>' : '<small>' + resultados.datos[0].REEMPLAZA_A + '</small>';
        document.getElementById('creacion_documento').innerHTML = '<small>' + mysql_to_dtl(resultados.datos[0].FECHA_CREACION) + '</small>';
        document.getElementById('publicado_documento').innerHTML = '<small>' + ((resultados.datos[0].PUBLICADO_CLIENTE === "0") ? 'NO' : 'SI') + '</small>';
        document.getElementById('recibido_documento').innerHTML = '<small>' + ((resultados.datos[0].RECIBIDO_CLIENTE === "0") ? 'NO' : 'SI') + '</small>';
        button.disabled = false;
        invocar_modal(ver_doc);
    } catch (e) {
        console.log(e);
    }
}

async function obtener_documento_raw(id) {
    try {
        let entrada = {vdi: id};
        let datos = await fetch(http + '/documento/api_datosdocumento', {
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
    }
}

/* ------------- GESTION DE DOCS POR SERVICIO ------------- */

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

async function subir_documentos(button) {
    try {
        button.disabled = true;
        resetear_subida();
        let modal = document.getElementById('modal_subida_documentos');
        await llenar_cbo_doc_reemplazar();
        invocar_modal(modal);
        button.disabled = false;
    } catch (e) {
        console.log("panel_documento", e);
        button.disabled = false;
    }

}

async function subir_fotos(button) {
    try {
        button.disabled = true;
        resetear_subida();
        let modal = document.getElementById('modal_subida_fotos');
        await llenar_cbo_fotos_reemplazar();
        invocar_modal(modal);
        button.disabled = false;
    } catch (e) {
        console.log("panel_documento", e);
        button.disabled = false;
    }
}

/* ----- servicio_documento y galeria ---- */
if (document.getElementById('area_dd')) {
    let fileInput = document.getElementById('archivos_input_hidden');

    let dropZone = document.getElementById('area_dd');

    let lista_archivos = document.getElementById('lista_archivos_subir');

    let seleccionados = [];

    let permitidos_documentos = ["doc", "docx", "pdf", "ppt", "pptx", "rar", "xls", "xlsx", "zip"];
    let permitidos_imagenes = ["jpg", "jpeg", "png"];

    fileInput.addEventListener('change', (e) => {
        let files = e.target.files;
        borrar_seleccion_raw();
        var validos = null;

        if (document.getElementById('doc')) {
            validos = filtrado_documentos(files);
        } else if (document.getElementById('img')) {
            validos = filtrado_imagenes(files);
        }

        seleccionados = seleccionados.concat(Array.from(validos));
        manejar_subida_archivos(seleccionados, lista_archivos);
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.remove('panel-info');
        /*clase highlight*/
        dropZone.classList.add('panel-advertencia');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('panel-advertencia');
        dropZone.classList.add('panel-info');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        borrar_seleccion_raw();
        dropZone.classList.remove('panel-advertencia');
        dropZone.classList.add('panel-info');

        let files = e.dataTransfer.files;
        let validos = null;

        if (document.getElementById('doc')) {
            validos = filtrado_documentos(files);
        } else if (document.getElementById('img')) {
            validos = filtrado_imagenes(files);
        }

        seleccionados = seleccionados.concat(Array.from(validos));
        manejar_subida_archivos(seleccionados, lista_archivos);
    });

    // También puedes agregar un evento clic al div dropZone para activar el input de archivo
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    function filtrado_documentos(files) {
        return Array.from(files).filter(file => {
            const fileExtension = getFileExtension(file.name);
            return permitidos_documentos.includes(fileExtension.toLowerCase());
        });
    }

    function filtrado_imagenes(files) {
        return Array.from(files).filter(file => {
            const fileExtension = getFileExtension(file.name);
            return permitidos_imagenes.includes(fileExtension.toLowerCase());
        });
    }

    // Función para procesar y mostrar archivos
    function manejar_subida_archivos(files, div_lista) {
        div_lista.innerHTML = '';

        for (const file of files) {
            const listItem = document.createElement('li');
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2); // Tamaño en MB con dos decimales
            listItem.textContent = `${file.name} (${fileSizeMB} MB)`;
            div_lista.appendChild(listItem);
        }

        console.log(div_lista, files);
    }

    function getFileExtension(filename) {
        return filename.split('.').pop();
    }

    function borrar_seleccion_raw() {
        seleccionados = [];
        lista_archivos.innerHTML = '';
    }

    function borrar_seleccion(button) {
        try {
            button.disabled = true;
            borrar_seleccion_raw();
            button.disabled = false;
        } catch (e) {
            button.disabled = false;
            console.log('panel_documento', e);
        }

    }
}

function cancelar_subir_archivos(button, modal_n) {
    try {
        button.disabled = true;
        let modal = document.getElementById(modal_n);
        cerrar_modal(modal);
        resetear_subida();
        button.disabled = false;
    } catch (e) {
        console.log('panel_documento', e);
        button.disabled = false;
    }
}

/* -------- SUBIDA DE UNA ------------ */

function resetear_subida() {
    try {
        let formulario = document.getElementById('formulario_subida_documento');
        formulario.reset();
    } catch (e) {
        console.log('panel_documento', e);
    }

}



async function subir_documento_ok(button) {
    let nombre_modal = (document.getElementById('modal_subida_documentos') ? 'modal_subida_documentos' : 'modal_subida_fotos');
    button.disabled = true;

    try {
        if (document.getElementById('txtNombreArchivo').value.trim().length === 0) {
            alert("Debe colocar un nombre a este documento");
            button.disabled = false;
            return;
        }

        if (document.getElementById('archivo').files.length === 0) {
            alert("Debe seleccionar un documento fisico para subir");
            button.disabled = false;
            return;
        }

        let nombrearchivo = document.getElementById('txtNombreArchivo').value;
        let archivo_raw = document.getElementById('archivo');
        let archivo = archivo_raw.files[0];
        let progressBar = document.getElementById('subida_carga_bar');

        let reemplazar = document.getElementById("cboReemplazar").value;
        let descripcion = document.getElementById("txtDescripcion").value;

        let formData = new FormData();

        formData.append('nombre', nombrearchivo);
        formData.append('archivo', archivo);
        formData.append('cu_visita', visita_codigo_unico);
        formData.append('reemplazar', reemplazar);
        formData.append('descripcion', descripcion);

        document.getElementById('tr_carga').style.display = '';

        let datos = await fetch(http + '/documento/api_recibirArchivo', {
            method: 'POST',
            body: formData
        });

        // Agregar un evento de progreso a la solicitud fetch
        let reader = datos.body.getReader();
        let totalBytes = 0;

        while (true) {
            const {done, value} = await reader.read();
            if (done) {
                progressBar.value = 100;
                //document.getElementById('tr_carga').style.display = 'none';
                break;
            }
            totalBytes += value.byteLength;
            actualizarProgressBar({loaded: totalBytes, total: archivo.size}, progressBar);
        }

        if (!datos.ok) {
            throw new Error('Error en la solicitud.');
        }

        let resultado = await datos.clone().json();
        console.log(resultado);
        cancelar_subir_archivos(button, nombre_modal);
    } catch (e) {
        cancelar_subir_archivos(button, nombre_modal);
        console.log('panel_documento', e);
    }

    if (document.getElementById('modal_subida_documentos')) {
        llenar_listado_documentos();
    } else if (document.getElementById('modal_subida_fotos')) {
        llenar_listado_fotos();
    }

    button.disabled = false;

}

async function listar_fotos_por_visita() {
    try {
        let entrada = {"visita_id": visita_id_static};
        let datos = await fetch(http + '/documento/api_listarfotos_visita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();
        return resultado;
    } catch (e) {
        console.log('panel_documento', e);
    }

}

async function listar_documentos_por_visita() {
    try {

        /* funcion a llamarse al cargar el listado de documentos */
        let entrada = {"visita_id": visita_id_static};
        let datos = await fetch(http + '/documento/api_listardocumentos_visita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();
        return resultado;

    } catch (e) {
        console.log('panel_documento', e);
    }

}

async function llenar_cbo_fotos_reemplazar() {
    try {
        if (document.getElementById('cboReemplazar')) {
            let cbo = document.getElementById('cboReemplazar');
            let documentos_raw = await listar_fotos_por_visita();


            if (documentos_raw.resultado == '0' || documentos_raw.datos[0].resultado == '0') {
                /* No se encontraron documentos */
                return;
            }

            for (var i = 0; i < documentos_raw.datos.length; i++) {
                var option = document.createElement("option");
                option.value = documentos_raw.datos[i].CODIGO_UNICO_DOCUMENTO;
                option.text = documentos_raw.datos[i].NOMBRE + ' (' + documentos_raw.datos[i].PESO + ')';
                cbo.appendChild(option);
            }
        }
    } catch (e) {
        console.log('panel_documento', e);
    }
}

async function llenar_cbo_doc_reemplazar() {
    try {
        if (document.getElementById('cboReemplazar')) {
            let cbo = document.getElementById('cboReemplazar');
            let documentos_raw = await listar_documentos_por_visita();


            if (documentos_raw.resultado == '0' || documentos_raw.datos[0].resultado == '0') {
                /* No se encontraron documentos */
                return;
            }

            for (var i = 0; i < documentos_raw.datos.length; i++) {
                var option = document.createElement("option");
                option.value = documentos_raw.datos[i].CODIGO_UNICO_DOCUMENTO;
                option.text = documentos_raw.datos[i].NOMBRE + ' (' + documentos_raw.datos[i].PESO + ')';
                cbo.appendChild(option);
            }
        }
    } catch (e) {
        console.log('panel_documento', e);
    }

}

function mostrar_foto(nombre, ruta, desc, cu) {
    try {
        
        var botones = '<button class="input-info" onclick="to_new(\'' + http + '/static/' + ruta + '\')">Descarga</button>';
        botones += '<button class="input-alerta" onclick="img_borrar_ok(this,\'' + cu + '\')">Eliminar</button>';
        botones += '<button class="input-exito" onclick="doc_publicar(this,\'' + cu + '\')">Publicar a cliente</button>';
        
        document.getElementById('mostrar_foto_nombre').innerHTML = nombre;
        document.getElementById('mostrar_foto_foto').innerHTML = '<img src="' + http + '/static/' + ruta + '" class="responsive">';
        document.getElementById('mostrar_foto_descripcion').innerHTML = desc;
        document.getElementById('mostrar_foto_opciones').innerHTML = botones;
        
        let modal = document.getElementById('modal_mostrar_foto');
        invocar_modal(modal);
    } catch (e) {
        console.log('panel_documento', e);
    }
}

async function llenar_listado_fotos() {
    try {
        if (document.getElementById('fotos_servicio_contenido')) {
            let fotos = await listar_fotos_por_visita();
            let div = document.getElementById('fotos_servicio_contenido');

            let contenido = '';
            if (fotos.resultado == '0' || fotos.datos[0].resultado == '0') {
                contenido += '<div class="panel panel-exito" style="color: var(--negro) !important; text-align:center !important">';
                contenido += 'Este servicio no cuenta con fotos adjuntas';
                contenido += '</div>';
                div.innerHTML = contenido;
                return;
            }

            contenido += '<div class="panel panel-exito">';
            contenido += '<div class="card-container" style="color: var(--negro) !important; text-align:center !important">';

            for (var i = 0; i < fotos.datos.length; i++) {
                contenido += '<a href="javascript:void(0)" onclick="mostrar_foto(\'' + fotos.datos[i].NOMBRE + '\', \'' + fotos.datos[i].RUTA_DOCUMENTO + '\',\'' + fotos.datos[i].DESCRIPCION + '\',\'' + fotos.datos[i].CODIGO_UNICO_DOCUMENTO + '\')">';
                contenido += '<div class="card card-link" style="background-color: white !important">';
                contenido += '<img src="' + http + '/static/' + fotos.datos[i].RUTA_DOCUMENTO + '" alt="' + fotos.datos[i].NOMBRE + '">';
                contenido += '<div class="card-body">';
                contenido += '<p class="card-text" style="text-align:center"><b>' + fotos.datos[i].NOMBRE + ':</b> ' + fotos.datos[i].DESCRIPCION + '</p>';
                contenido += '</div>';
                contenido += '</div>';
            }

            contenido += '</div></div>';
            div.innerHTML = contenido;
        }
    } catch (e) {
        console.log('panel_documento', e);
    }
}

async function llenar_listado_documentos() {
    try {
        if (document.getElementById('documentos_servicio_contenido')) {
            let documentos = await listar_documentos_por_visita();

            let div = document.getElementById('documentos_servicio_contenido');
            let contenido = '';

            contenido += '<table class="responsive tabla-blanca espaciado">';
            contenido += '<tr>';
            contenido += '<th style="width: 10%">Fecha</th>';
            contenido += '<th style="width: 20%">Nombre</th>';
            contenido += '<th style="width: 15%">Subido por</th>';
            contenido += '<th style="width: 10%">Tama&ntilde;o</th>';
            contenido += '<th style="width: 5%">Tipo</th>';
            contenido += '<th style="width: 10%">Publicado</th>';
            contenido += '<th style="width: 10%">Visto</th>';
            contenido += '<th style="width: 20%"><i class="fa fa-cogs"></i></th>';
            contenido += '</tr>';


            if (documentos.resultado == '0' || documentos.datos[0].resultado == '0') {
                contenido += '<tr>';
                contenido += '<td colspan="11" class="td_center">No se encontraron documentos en este servicio</td>';
                contenido += '</tr>';
                contenido += '</table>';
                div.innerHTML = contenido;
                return;
            }


            for (var i = 0; i < documentos.datos.length; i++) {
                var publicado = (documentos.datos[i].PUBLICADO == '1' ? 'S&Iacute;' : 'NO');
                var visto = (documentos.datos[i].RECIBIDO == '1' ? 'S&Iacute;' : 'NO');

                contenido += '<tr>';
                contenido += '<td class="td_center">' + mysql_to_dtl(documentos.datos[i].FECHA_CREACION) + '</td>';
                contenido += '<td class="td_center">' + documentos.datos[i].NOMBRE + '</td>';
                contenido += '<td class="td_center">' + documentos.datos[i].AUTOR_NOMBRES + ' ' + documentos.datos[i].AUTOR_APELLIDOS + ' (DNI: ' + documentos.datos[i].AUTOR_DNI + ')</td>';
                contenido += '<td class="td_center">' + documentos.datos[i].PESO + '</td>';
                contenido += '<td class="td_center">' + extension_icon(documentos.datos[i].EXTENSION) + '</td>';
                contenido += '<td class="td_center">' + publicado + '</td>';
                contenido += '<td class="td_center">' + visto + '</td>';
                contenido += '<td class="td_center">';
                contenido += '<button onclick="doc_descargar(\'' + documentos.datos[i].CODIGO_UNICO_DOCUMENTO + '\', \'' + documentos.datos[i].NOMBRE + '.' + documentos.datos[i].EXTENSION + '\')" class="input-info" title="Descargar" alt="Descargar"><i class="fas fa-download"></i></button>';
                contenido += '<button onclick="doc_borrar(\'' + documentos.datos[i].CODIGO_UNICO_DOCUMENTO + '\', \'' + documentos.datos[i].NOMBRE + '\')" class="input-alerta" title="Borrar" alt="Borrar"><i class="fas fa-times"></i></button>';
                contenido += '<button onclick="doc_publicar(\'' + documentos.datos[i].CODIGO_UNICO_DOCUMENTO + '\')" class="input-exito" title="Publicar" alt="Publicar">PUBL</button>';
                contenido += '</td>';
                contenido += '</tr>';
            }

            contenido += '</table>';
            div.innerHTML = contenido;
        }
    } catch (e) {
        console.log('panel_documento', e);
    }

}

function actualizar_documentos(button) {
    try {
        button.disabled = true;
        llenar_listado_documentos();
        button.disabled = false;
    } catch (e) {
        console.log('panel_documento', e);
        button.disabled = false;
    }
}

function actualizar_fotos(button) {
    try {
        button.disabled = true;
        llenar_listado_fotos();
        button.disabled = false;
    } catch (e) {
        console.log('panel_documento', e);
        button.disabled = false;
    }
}

function doc_publicar(codigo_unico) {

}

async function img_borrar_ok(button, cu) {
    try {
        button.disabled = true;
        if (confirm("Se borrara PERMANENTEMENTE LA FOTO, " + String.fromCharCode(191) + "PROCEDER?")) {

            let entrada = {'codigo_unico': cu};
            let datos = await fetch(http + '/documento/api_borrarDocumento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entrada)
            });

            let resultado = await datos.json();
            llenar_listado_fotos();
            cancelar_subir_archivos(button, 'modal_mostrar_foto');

            if (resultado.resultado == '1') {
                alert(resultado.datos[0].mensaje);
            } else {
                alert(resultado.mensaje);
            }

            llenar_listado_documentos();
        }

        button.disabled = false;
    } catch (e) {
        button.disabled = false;
        console.log('panel_documento', e);
    }
}

function doc_borrar(codigo_unico, nombre_doc) {
    try {
        let modal = document.getElementById('modal_borrar_documento');
        document.getElementById('codigo_unico_borrar_documento').value = codigo_unico;
        document.getElementById('nombre_borrar_documento').innerHTML = nombre_doc;
        invocar_modal(modal);
    } catch (e) {
        console.log('panel_documento', e);
    }
}

async function doc_borrar_ok(button) {
    try {
        button.disabled = true;
        let entrada = {'codigo_unico': document.getElementById('codigo_unico_borrar_documento').value};
        let datos = await fetch(http + '/documento/api_borrarDocumento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        let resultado = await datos.json();
        cancelar_subir_archivos(button, 'modal_borrar_documento');

        if (resultado.resultado == '1') {
            alert(resultado.datos[0].mensaje);
        } else {
            alert(resultado.mensaje);
        }

        llenar_listado_documentos();
        button.disabled = false;
    } catch (e) {
        button.disabled = false;
        console.log('panel_documento', e);
    }
}

async function doc_descargar(codigo_unico, nombre_archivo) {
    try {
        let url = http + '/documento/api_descargarDocumento';
        /*
         let params = new URLSearchParams();
         params.append('codigo_unico', codigo_unico);*/

        let entrada = {'codigo_unico': codigo_unico};
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entrada)
        });

        if (response.ok) {
            let blob = await response.blob();

            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = nombre_archivo;
            link.click();
        } else {
            console.log('Error al descargar el archivo:', response.status);
        }
    } catch (e) {
        console.log('panel_documento', e);
    }
}

// Crear una función para actualizar la barra de progreso
function actualizarProgressBar(event, progressBar) {
    if (event.lengthComputable) {
        const porcentaje = (event.loaded / event.total) * 100;
        progressBar.value = porcentaje;
    }
}

