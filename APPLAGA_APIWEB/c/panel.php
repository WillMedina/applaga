<?php      

class panel implements controlador
{

    private $parametros;
    private $applaga;

    public function __construct($args)
    {
        $this->parametros = $args;
        $this->applaga = new applaga(0);
    }

    public function run()
    {
        $this->security();
        $cambios = [
            '{TITULO}' => 'INICIO - APPLAGA'
        ];

        /*
          $contenido = '<div class="contenedor_panel">Bienvenido a Applaga {USUARIO_DATA}, ' .
          'elija una de las opciones de la barra de la izquierda (o del bot&oacute;n de men&uacute; en ' .
          'la versi&oacute;n movil) para poder operar</div>'; */

        $contenido = '';

        $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_dashboard.html';
        $parser = new parserHTML($plantilla);
        $contenido .= $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function servicio()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'SERVICIOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_servicio.js?v={STATICVERSION}"></script>'
        ];

        //el parametro 2 es el que viene despues del link
        $contenido = '';

        if (isset($this->parametros[2]) and is_numeric($this->parametros[2])) {
            //esto significa que es un numero de servicio
            $visita_id = $this->parametros[2];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inexistente, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            } else if ($visita->getActivo() == 0) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inactivo, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            }

            $datos_visita = $visita->getData();
            $codigo_unico = $datos_visita->CODIGO_UNICO;

            utils::redireccion($this->applaga::URL . '/panel/servicio/' . $codigo_unico);
        } else if (isset($this->parametros[2]) and strlen($this->parametros[2]) === 32) {
            //esto es que es un codigo unico
            $visita_codigo_unico = $this->parametros[2];
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_visita_codigounico', [$visita_codigo_unico]);

            if ($sp[0]['resultado'] == '0') {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "No se encontro ninguna visita con el codigo unico consultado en parametros[2]: " . $codigo_unico . " - Mensaje error: " . $sp[0]['mensaje'],
                        "c/panel.php:servicio");
            }

            $visita_id = $sp[0]['VISITA_ID'];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inexistente, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            } else if ($visita->getActivo() == 0) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inactivo, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            }

            $contenido = $visita->servicio_html();
        } else if (isset($this->parametros[2]) and $this->parametros[2] == 'nuevo') {
            //esto significa panel/servicio/registrar
            $plantilla_nuevo = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_servicios_nuevo.html';
            $parser = new parserHTML($plantilla_nuevo);
            $contenido .= $parser->print(true);
        } else if (isset($this->parametros[2]) and $this->parametros[2] == 'editar' and is_numeric($this->parametros[3])) {

            //esto significa panel/servicio/editar/<numero de id>
            $visita_id = $this->parametros[3];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inexistente para edicion, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            } else if ($visita->getActivo() == 0) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inactivo para edicion, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            }

            $datos_visita = $visita->getData();
            $cambios['{VISITA_ID}'] = $datos_visita->VISITA_ID;
            $cambios['{CODIGO_UNICO}'] = $datos_visita->CODIGO_UNICO;
            $cambios['{LOCAL_ID}'] = $datos_visita->LOCAL_ID;
            $cambios['{RESPONSABLE_LOCAL}'] = $datos_visita->RESPONSABLE_EN_VISITA;
            $cambios['{CARGO}'] = $datos_visita->CARGO_DE_RESPONSABLE_EN_VISITA;
            $cambios['{N_CONSTANCIA}'] = $datos_visita->NUMERO_CONSTANCIA;
            $cambios['{CLIENTE_ID}'] = $datos_visita->CLIENTE_ID;
            $cambios['{DT_INICIO}'] = $datos_visita->INICIO;
            $cambios['{DT_FIN}'] = $datos_visita->FIN;
            $cambios['{N_CERTIFICADO}'] = $datos_visita->NUMERO_CERTIFICADO;
            $cambios['{V_CERTIFICADO}'] = $datos_visita->VENCIMIENTO_CERTIFICADO;
            $cambios['{OBS_REC}'] = $datos_visita->OBSERVACIONES_Y_RECOMENDACIONES;
            $cambios['{OBS_CLI}'] = $datos_visita->OBSERVACIONES_CLIENTE;
            $cambios['{COND_INT}'] = $datos_visita->CONDICIONES_INTERNAS;
            $cambios['{COND_EXT}'] = $datos_visita->CONDICIONES_EXTERNAS;
            $cambios['{VISTO_BUENO}'] = $datos_visita->VISTOBUENO_CLIENTE;

            $plantilla_editar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_servicios_editar.html';
            $parser = new parserHTML($plantilla_editar);
            $contenido .= $parser->print(true);
        } else {
            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_servicios_listar.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);
        }

        $this->layout($contenido, $cambios);
    }

    public function servicio_pc()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'SERVICIOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_punto.js?v={STATICVERSION}"></script>'
        ];

        if (isset($this->parametros[2]) and strlen($this->parametros[2]) === 32) {
            $contenido = '';

            $visita_codigo_unico = $this->parametros[2];
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_visita_codigounico', [$visita_codigo_unico]);

            if ($sp[0]['resultado'] == '0') {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "No se encontro ninguna visita con el codigo unico consultado en parametros[2]: " . $codigo_unico . " - Mensaje error: " . $sp[0]['mensaje'],
                        "c/panel.php:servicio_pc");
            }

            $visita_id = $sp[0]['VISITA_ID'];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inexistente, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio_pc");
            } else if ($visita->getActivo() == 0) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inactivo, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio_pc");
            }

            $cambios['{VISITA_ID}'] = $visita_id;
            $cambios['{N_CONSTANCIA}'] = $sp[0]['NUMERO_CONSTANCIA'];
            $cambios['{CODIGO_UNICO}'] = $sp[0]['CODIGO_UNICO'];
            $cambios['{LOCAL_ID}'] = $sp[0]['LOCAL_ID'];

            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_servicio_puntos.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);

            $this->layout($contenido, $cambios);
        } else {
            utils::redireccion_y_log($this->applaga::URL . '/panel',
                    "Intento de acceder a los puntos de control con parametros invalidos",
                    "c/panel.php:servicio_pc");
        }
    }

    public function servicio_documentos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'SERVICIOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_documento.js?v={STATICVERSION}"></script>'
        ];

        if (isset($this->parametros[2]) and strlen($this->parametros[2]) === 32) {
            $contenido = '';

            $visita_codigo_unico = $this->parametros[2];
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_visita_codigounico', [$visita_codigo_unico]);

            if ($sp[0]['resultado'] == '0') {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "No se encontro ninguna visita con el codigo unico consultado en parametros[2]: " . $codigo_unico . " - Mensaje error: " . $sp[0]['mensaje'],
                        "c/panel.php:servicio_documentos");
            }

            $visita_id = $sp[0]['VISITA_ID'];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inexistente, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            } else if ($visita->getActivo() == 0) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inactivo, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            }

            $cambios['{VISITA_ID}'] = $visita_id;
            $cambios['{N_CONSTANCIA}'] = $sp[0]['NUMERO_CONSTANCIA'];
            $cambios['{CODIGO_UNICO}'] = $sp[0]['CODIGO_UNICO'];

            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_documentos_servicio_listar.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);

            $this->layout($contenido, $cambios);
        } else {
            utils::redireccion_y_log($this->applaga::URL . '/panel',
                    "Intento de acceder a la documentacion con parametros invalidos",
                    "c/panel.php:servicio_documentos");
        }
    }

    public function servicio_fotos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'SERVICIOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_documento.js?v={STATICVERSION}"></script>'
        ];

        if (isset($this->parametros[2]) and strlen($this->parametros[2]) === 32) {
            $contenido = '';

            $visita_codigo_unico = $this->parametros[2];
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_visita_codigounico', [$visita_codigo_unico]);

            if ($sp[0]['resultado'] == '0') {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "No se encontro ninguna visita con el codigo unico consultado en parametros[2]: " . $codigo_unico . " - Mensaje error: " . $sp[0]['mensaje'],
                        "c/panel.php:servicio_fotos");
            }

            $visita_id = $sp[0]['VISITA_ID'];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inexistente, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            } else if ($visita->getActivo() == 0) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un servicio inactivo, codigo de servicio solicitado: " . $visita_id,
                        "c/panel.php:servicio");
            }

            $cambios['{VISITA_ID}'] = $visita_id;
            $cambios['{N_CONSTANCIA}'] = $sp[0]['NUMERO_CONSTANCIA'];
            $cambios['{CODIGO_UNICO}'] = $sp[0]['CODIGO_UNICO'];

            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_documentos_servicio_galeria.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);

            $this->layout($contenido, $cambios);
        } else {
            utils::redireccion_y_log($this->applaga::URL . '/panel',
                    "Intento de acceder a una galeria con parametros invalidos",
                    "c/panel.php:servicio_documentos");
        }
    }

    public function documento()
    {
        //este ser solo un buscador de documentacion
        $this->security(1);

        $cambios = [
            '{TITULO}' => 'DOCUMENTACION - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_documento.js?v={STATICVERSION}"></script>'
        ];

        $contenido = '';

        $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_documentos_listar.html';
        $parser = new parserHTML($plantilla_listar);
        $contenido .= $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function datos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'BIBLIOTECA DE DATOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_datos.js?v={STATICVERSION}"></script>'
        ];

        $contenido = '';

        $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_bibl_datos.html';
        $parser = new parserHTML($plantilla_listar);
        $contenido .= $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function clientes()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'CLIENTES - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_datos.js?v={STATICVERSION}"></script>'
        ];

        $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_datos_clientes.html';
        $parser = new parserHTML($plantilla);
        $contenido = $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function locales()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'LOCALES - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_datos.js?v={STATICVERSION}"></script>'
        ];

        $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_datos_locales.html';
        $parser = new parserHTML($plantilla);
        $contenido = $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function productos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'PRODUCTOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_datos.js?v={STATICVERSION}"></script>'
        ];

        $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_datos_productos.html';
        $parser = new parserHTML($plantilla);
        $contenido = $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function operarios()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'OPERARIOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_datos.js?v={STATICVERSION}"></script>'
        ];

        $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_datos_operarios.html';
        $parser = new parserHTML($plantilla);
        $contenido = $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function equipamentos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'EQUIPAMENTO - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_datos.js?v={STATICVERSION}"></script>'
        ];

        $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_datos_equipamento.html';
        $parser = new parserHTML($plantilla);
        $contenido = $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function menu_puntos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'ADMINISTRACI&Oacute;N DE PUNTOS DE CONTROL - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/lib/qrious/qrious.min.js"></script>'
            . "\n" . '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_punto.js?v={STATICVERSION}"></script>'
        ];

        $contenido = '';

        $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_puntos_menu.html';
        $parser = new parserHTML($plantilla_listar);
        $contenido .= $parser->print(true);
        $this->layout($contenido, $cambios);
    }

    public function insectos()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'PUNTOS DE CONTROL:INSECTOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/lib/qrious/qrious.min.js"></script>'
            . "\n" . '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_insectos.js?v={STATICVERSION}"></script>'
            . "\n" . '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>'
            . "\n" . '<script defer src="' . $this->applaga::URL . '/v/funcjs/generacion_graficos.js?v={STATICVERSION}"></script>'
        ];

        $contenido = '';
        if (isset($this->parametros[2]) and is_numeric($this->parametros[2])) {
            $insectos_id = $this->parametros[2];
            $insectos = new insectos_m($insectos_id);
            if (!$punto->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un punto de insectos inexistente, codigo de servicio solicitado: " . $insectos_id,
                        "c/panel.php:insectos");
            }

            $contenido = $insectos->insectos_html();
        } else if (isset($this->parametros[2]) and $this->parametros[2] == "nuevo") {
            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_insectos_nuevo.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);
        } else {
            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_insectos_listar.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);
        }

        $this->layout($contenido, $cambios);
    }

    public function punto()
    {
        $this->security(1);
        $cambios = [
            '{TITULO}' => 'PUNTOS DE CONTROL:CEBADEROS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/lib/qrious/qrious.min.js"></script>'
            . "\n" . '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_punto.js?v={STATICVERSION}"></script>'
        ];

        $contenido = '';

        if (isset($this->parametros[2]) and is_numeric($this->parametros[2])) {
            $punto_id = $this->parametros[2];
            $punto = new punto_m($punto_id);
            if (!$punto->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Intento de acceder a un punto inexistente, codigo de servicio solicitado: " . $punto_id,
                        "c/panel.php:punto");
            }

            $contenido = $punto->punto_html();
        } else if (isset($this->parametros[2]) and $this->parametros[2] == "nuevo") {
            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_puntos_nuevo.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);
        } else {
            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_puntos_listar.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);
        }

        $this->layout($contenido, $cambios);
    }

    public function usuario()
    {
        $cambios = [
            '{TITULO}' => 'CONFIG USUARIO - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_config_usuario.js?v={STATICVERSION}"></script>'
        ];

        $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/config_usuario.html';
        $parser = new parserHTML($plantilla_listar);
        $contenido = $parser->print(true);

        $this->layout($contenido, $cambios);
    }

    public function mis_servicios()
    {
        $this->security('cliente');
        $cambios = [
            '{TITULO}' => 'MIS SERVICIOS - APPLAGA',
            '{JS}' => '<script defer src="' . $this->applaga::URL . '/v/funcjs/panel_cliente_servicio.js?v={STATICVERSION}"></script>'
        ];

        $contenido = '';
        $info_sesion = sesion::info_sesion();
        $username = $info_sesion['info_sesion']['USUARIO'];

        if (isset($this->parametros[2]) and strlen($this->parametros[2]) === 32) {
            //si tiene 36 caracteres es posible codigo_unico
            $bd = bd::getInstance();
            $codigo_unico = $this->parametros[2];
            $sp = $bd->store_procedure('obtener_visita_codigounico', [$codigo_unico]);

            if ($sp[0]['resultado'] == "0") {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "No se encontro ninguna visita con el codigo unico consultado en parametros[2]: " . $codigo_unico . " - Mensaje error: " . $sp[0]['mensaje'],
                        "c/panel.php:mis_servicios");
            }

            $visita_id = $sp[0]['VISITA_ID'];
            $visita = new visita($visita_id);

            if (!$visita->existe()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Error interno, no existe tal visita con codigo unico: " . $codigo_unico . " - Visita ID: " . $visita_id,
                        "c/panel.php:mis_servicios");
            }

            if (!$visita->acceso($username)) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Error interno, el usuario $username no tiene acceso como cliente de " . $visita_id,
                        "c/panel.php:mis_servicios");
            }

            $contenido .= $visita->cliente_servicio_html();
        } else if (!isset($this->parametros[2])) {
            $plantilla_listar = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/cliente_servicios_listar.html';
            $parser = new parserHTML($plantilla_listar);
            $contenido .= $parser->print(true);
        }

        $this->layout($contenido, $cambios);
    }

    protected function security_api($tipousuario = null)
    {
        //funcion que verifica que si no existe sesion, te regrese al login
        //si esta todo bien, no hace nada
        $incidente_timestamp = date("Ymd.His");
        $acceso = (strlen($_SERVER['REQUEST_URI']) > 0 ? $_SERVER['REQUEST_URI'] : '[REQUEST_URI_OCULTA]');

        if (!sesion::existe_sesion()) {
            logger::log("[Incidente #$incidente_timestamp] Fallo en permisos de seguridad (no existe sesion). Tipo de usuario: " . (is_null($tipousuario) ? 'NULL' : $tipousuario)
                    . " INTENTO DE ACCESO DESDE [$acceso]", "c/panel.php:security_api");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0,
                'mensaje' => 'No existe una sesion de usuario.',
                'incidente' => $incidente_timestamp, 'acceso' => $acceso]);
            die();
        }


        if (!is_null($tipousuario) and !$this->security_type($tipousuario)) {
            logger::log("[Incidente #$incidente_timestamp] Fallo en permisos de seguridad (no existe sesion). Tipo de usuario: " . (is_null($tipousuario) ? 'NULL' : $tipousuario)
                    . " INTENTO DE ACCESO DESDE [$acceso]", "c/panel.php:security_api");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0,
                'mensaje' => "Fallo en permisos de seguridad (no autorizado). Tipo de usuario: " . (is_null($tipousuario) ? 'NULL' : $tipousuario),
                'incidente' => $incidente_timestamp, 'acceso' => $acceso]);
            die();
        }
    }

    /**
     * Servicio que ve que el $cliente_username tenga acceso a $visita_id
     */
    protected function security_cliente_access($cliente_username, $visita_id)
    {
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('accesocliente_visita', [$cliente_username, $visita_id]);
        return ($sp[0]['ACCESO'] == "1" ? true : false);
    }

    protected function security($tipousuario = null)
    {
        //funcion que verifica que si no existe sesion, te regrese al login
        //si esta todo bien, no hace nada
        $incidente_timestamp = date("Ymd.His");
        $acceso = $_SERVER["REQUEST_URI"] ?? '[REQUEST URI OCULTA]';

        if (!sesion::existe_sesion()) {
            $loc = $this->applaga::URL . '/login';

            if (!is_null($tipousuario)) {
                logger::log("#$incidente_timestamp : fallo en panel:security con tipo de usuario: " .
                        $tipousuario . " queriendo acceder desde [$acceso] - No existe sesion o ha acabado.", "c/panel.php:security");
            }

            header("Location: $loc");
            die();
        }

        if (!is_null($tipousuario) and !$this->security_type($tipousuario)) {
            utils::redireccion_y_log($this->applaga::URL . '/panel',
                    "INCIDENTE #$incidente_timestamp : fallo en panel:security con tipo de usuario: " .
                    (is_null($tipousuario) ? 'NULL' : $tipousuario) . " queriendo acceder desde [$acceso]",
                    "c/panel.php:security");
        }
    }

    /**
     *  $tipousuario solo puede ser cliente o id de tipousuario
     */
    private function security_type($tipousuario)
    {
        //se entiende que al llegar a este metodo, se ha pasado
        //por security() y ha dado true
        $info_usuario = sesion::info_sesion();
        $tiposesion = $info_usuario["info_sesion"]['TIPO'];

        if ($tiposesion == 'cliente') {
            return ($tipousuario == $tiposesion);
        } else {
            //sino es cliente VERIFICA SI ES ALGUNO DE LOS ID
            return ($tipousuario == $info_usuario['info_usuario']['TIPOUSUARIO_ID']);
        }
    }

    private function layout($contenido, $cambios_contenido = [])
    {
        try {
            $url_theme = $this->applaga::URL . '/v/' . $this->applaga::DEFULT_THEME;
            $template = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/panel_layout.html';

            $parser = new parserHTML($template);
            $info_usuario = sesion::info_sesion();

            //revisar sesion::info_sesion() para cambios:
            //$nombres = isset($info_usuario['info_usuario']['NOMBRES']) ? $info_usuario['info_usuario']['NOMBRES']. $info_usuario['info_usuario']['APELLIDOS'] : 
            $bienvenida = '';
            if ($info_usuario["info_sesion"]['TIPO'] == "cliente") {
                $bienvenida = 'Bienvenido al panel de control de Applaga, ' .
                        'ha ingresado con un usuario autorizado para <b>' . $info_usuario["info_usuario"]['RAZONSOCIAL'] . '</b>, ' .
                        'elija una de las opciones de la barra de la izquierda (o del botón de menú en la versión movil) para poder operar';
            } else {
                $bienvenida = 'Bienvenido a Applaga <b>' . $info_usuario['info_usuario']['NOMBRES'] . ' ' . $info_usuario['info_usuario']['APELLIDOS'] . '</b>,' .
                        ' elija una de las opciones de la barra de la izquierda (o del botón de menú en la versión movil) para poder operar';
            }

            $cambios_layout = [
                '{URL}' => $this->applaga::URL,
                '{URL_THEME}' => $url_theme,
                '{YEAR}' => date('Y'),
                '{BIENVENIDA}' => $bienvenida,
                '{SIDEBAR}' => $this->sidebar($info_usuario['info_usuario']['TABLA']),
                '{JS}' => ''
            ];

            //$cambios = $cambios_layout + $cambios_contenido;
            $cambios = array_merge($cambios_layout, $cambios_contenido);

            //esto para que al contenido tambien se le apliquen las llaves de cambios
            $contenido_saneado = $parser->cambioplano($contenido, $cambios);

            //al final se le agrega al array general el cambio del contenido mismo
            $cambios['{CONTENIDO}'] = $contenido_saneado;

            foreach ($cambios as $key => $value) {
                $parser->cambiar($key, $value);
            }

            header('Content-Type: text/html');
            $parser->print();
        } catch (Throwable $e) {
            $mensaje = 'Error ocurrido en el renderizado de la web. ' . $e->getMessage();
            $donde = 'c/panel.php:layout';
            logger::log($mensaje, $donde);
        }
    }

    private function sidebar($tipo_usuario)
    {
        $links = ($tipo_usuario == 'cliente') ? rutas::cliente() : rutas::usuario();
        $texto_final = '';
        foreach ($links as $key => $value) {
            $texto_final .= '<a href=\'' . $this->applaga::URL . "/$value'>$key</a>" . PHP_EOL;
        }

        return $texto_final;
    }
}
