<?php

class qr extends panel implements controlador
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
        //al usarse como API de servicios, el run principal siempre redirigira a panel
        $loc = $this->applaga::URL . '/panel';
        header("Location: $loc");
    }

    public function icaptura()
    {
        try {
            if (!isset($this->parametros[2])) {
                logger::log("Invocada la captura sin argumento de codigo unico", "c/qr:captura");
                $loc = $this->applaga::URL . '/panel';
                header("Location: $loc");
                die();
            }

            $codigo_unico = $this->parametros[2];

            $plantilla = '';
            $cambios = [];
            $info_sesion = sesion::info_sesion();

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_punto_insecto_uuid', [$codigo_unico]);

            $cambios["{URL_THEME}"] = $this->applaga::URL . '/v/' . $this->applaga::DEFULT_THEME;
            $cambios["{JS}"] = '<script defer src="' . $this->applaga::URL . '/v/funcjs/icaptura.js?v={STATICVERSION}"></script>';
            $cambios["{STATICVERSION}"] = modelo::STATICVERSIONS ? date("Ymdhis") : 'prod';
            $cambios["{URL}"] = $this->applaga::URL;

            //candado android
            if (!utils::es_android()) {
                logger::log("Hubo un intento de acceder a la parte de captura desde un dispositivo que no es Android", "c/qr:captura");
                $loc = $this->applaga::URL . '/panel';
                header("Location: $loc");
                die();
            }

            if ($sp[0]['resultado'] == "0") {
                $cambios["{MENSAJE}"] = '<div class="panel panel-alerta"><i class="fas fa-exclamation-triangle"></i> ' .
                        'Error: El QR capturado (CODIGO UNICO: <b>' . $codigo_unico . '</b>) no ha sido identificado en nuestro sistema.' .
                        ' Verificar los datos tomados o consultar con un administrador. <br><br><code>Error devuelto: ' . $sp[0]['mensaje'] . '</code>';
                $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_mensaje.html';
            } else {
                if (is_null($info_sesion)) {
                    //es que no hay ninguna sesion o no es usuario sino cliente
                    $cambios["{MENSAJE}"] = '<div class="panel panel-alerta"><i class="fas fa-exclamation-triangle"></i> ' .
                            'Error: No se ha iniciado sesion.</div><div>&nbsp;</div>';
                    $cambios["{CODIGO_UNICO}"] = $codigo_unico;
                    $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_login.html';
                } else if ($info_sesion["info_sesion"]['TIPO'] != 'usuario') {
                    //es que no hay ninguna sesion o no es usuario sino cliente
                    $cambios["{MENSAJE}"] = '<div class="panel panel-alerta"><i class="fas fa-exclamation-triangle"></i> ' .
                            'Error: El usuario que ha iniciado sesi&oacute;n no puede tomar capturas de puntos de control.</div>' .
                            '<form onsubmit="return false"><button onclick="cerrar_sesion()">Cerrar sesi&oacute;n</button></form>';
                    $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_mensaje.html';
                } else {
                    //$cambios["{INFO_SESION}"] = print_r($info_sesion, true);
                    $insectos_m = new insectos_m($sp[0]['PUNTOCONTROL_ID']);
                    $punto_data = $insectos_m->getData();

                    $nombre_op = $info_sesion['info_usuario']['NOMBRES'] . ' ' . $info_sesion['info_usuario']['APELLIDOS'];
                    $op_id = $info_sesion["info_usuario"]['USUARIO_ID'];

                    $cambios["{NOMBRE_OP}"] = $nombre_op;
                    $cambios["{QR}"] = $codigo_unico;
                    $cambios["{USUARIO_ID}"] = $op_id;
                    $cambios["{PUNTOCONTROL_ID}"] = $punto_data->PUNTOCONTROL_ID;
                    $cambios["{PUNTOCONTROL_NOMBRE}"] = $punto_data->PUNTOCONTROL_NOMBRE;
                    $cambios["{PUNTOCONTROL_UBICACION_LOCAL}"] = $punto_data->PUNTOCONTROL_UBICACION_LOCAL;
                    $cambios["{CLIENTE_RAZONSOCIAL}"] = $punto_data->CLIENTE_RAZONSOCIAL;
                    $cambios["{CLIENTELOCAL_DIRECCION}"] = $punto_data->CLIENTELOCAL_DIRECCION;
                    $cambios["{PUNTOCONTROL_NUMERO}"] = $punto_data->PUNTOCONTROL_NUMERO;
                    $cambios["{PUNTOCONTROL_MODELO}"] = $punto_data->PUNTOCONTROL_MODELO;
                    $cambios["{PUNTOCONTROL_GEOLOCALIZACION}"] = $punto_data->PUNTOCONTROL_GEOLOCALIZACION;

                    $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_punto_insectos.html';
                }
            }

            $parser = new parserHTML($plantilla);
            foreach ($cambios as $key => $value) {
                $parser->cambiar($key, $value);
            }

            $parser->print();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function captura()
    {
        try {
            if (!isset($this->parametros[2])) {
                utils::redireccion_y_log($this->applaga::URL . '/panel', "Invocada la captura sin argumento de codigo unico", "c/qr:captura");
            }

            $codigo_unico = $this->parametros[2];

            $plantilla = '';
            $cambios = [];
            $info_sesion = sesion::info_sesion();

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_punto_uuid', [$codigo_unico]);

            $cambios["{URL_THEME}"] = $this->applaga::URL . '/v/' . $this->applaga::DEFULT_THEME;
            $cambios["{JS}"] = '<script defer src="' . $this->applaga::URL . '/v/funcjs/captura.js?v={STATICVERSION}"></script>';
            $cambios["{URL}"] = $this->applaga::URL;

            //candado android
            if (!utils::es_movil_tablet()) {
                utils::redireccion_y_log($this->applaga::URL . '/panel',
                        "Hubo un intento de acceder a la parte de captura desde un dispositivo que no es Movil o Tablet",
                        "c/qr:captura");
            }

            if ($sp[0]['resultado'] == "0") {
                $cambios["{MENSAJE}"] = '<div class="panel panel-alerta texto-negro"><i class="fas fa-exclamation-triangle"></i> ' .
                        'Error: El QR capturado <code>(CODIGO UNICO: <b>' . $codigo_unico . '</b>)</code> no ha sido identificado en nuestro sistema.' .
                        ' Verificar los datos tomados o consultar con un administrador. <br><br><code>Error devuelto: ' . $sp[0]['mensaje'] . '</code>';

                $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_mensaje.html';
            } else {
                if (is_null($info_sesion)) {
                    //es que no hay ninguna sesion o no es usuario sino cliente
                    $cambios["{MENSAJE}"] = '<div class="panel panel-advertencia  texto-negro"><i class="fas fa-exclamation-triangle"></i> ' .
                            'No se ha iniciado sesi&oacute;n.</div><div>&nbsp;</div>';
                    $cambios["{CODIGO_UNICO}"] = $codigo_unico;
                    $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_login.html';
                } else if ($info_sesion["info_sesion"]['TIPO'] != 'usuario') {
                    //es que no hay ninguna sesion o no es usuario sino cliente
                    $cambios["{MENSAJE}"] = '<div class="panel panel-alerta texto-negro"><i class="fas fa-exclamation-triangle"></i> ' .
                            'Error: El usuario que ha iniciado sesi&oacute;n no puede tomar capturas de puntos de control.</div>' .
                            '<form onsubmit="return false"><button onclick="cerrar_sesion()">Cerrar sesi&oacute;n</button></form>';

                    $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_mensaje.html';
                } else {
                    //$cambios["{INFO_SESION}"] = print_r($info_sesion, true);
                    $punto_m = new punto_m($sp[0]['PUNTOCONTROL_ID']);
                    $punto_data = $punto_m->getData();

                    $nombre_op = $info_sesion['info_usuario']['NOMBRES'] . ' ' . $info_sesion['info_usuario']['APELLIDOS'];
                    $op_id = $info_sesion["info_usuario"]['USUARIO_ID'];

                    $cambios["{NOMBRE_OP}"] = $nombre_op;
                    $cambios["{QR}"] = $codigo_unico;
                    $cambios["{USUARIO_ID}"] = $op_id;
                    $cambios["{PUNTOCONTROL_ID}"] = $punto_data->PUNTOCONTROL_ID;
                    $cambios["{PUNTOCONTROL_NOMBRE}"] = $punto_data->PUNTOCONTROL_NOMBRE;
                    $cambios["{PUNTOCONTROL_UBICACION_LOCAL}"] = $punto_data->PUNTOCONTROL_UBICACION_LOCAL;
                    $cambios["{CLIENTE_RAZONSOCIAL}"] = $punto_data->CLIENTE_RAZONSOCIAL;
                    $cambios["{CLIENTELOCAL_DIRECCION}"] = $punto_data->CLIENTELOCAL_DIRECCION;
                    $cambios["{PUNTOCONTROL_NUMERO}"] = $punto_data->PUNTOCONTROL_NUMERO;
                    $cambios["{UNIDADMEDIDA}"] = $punto_data->UNIDADMEDIDA_NOMBRE;
                    $cambios["{PUNTOCONTROL_GEOLOCALIZACION}"] = $punto_data->PUNTOCONTROL_GEOLOCALIZACION;

                    $plantilla = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/captura_punto.html';
                }
            }

            $parser = new parserHTML($plantilla);
            foreach ($cambios as $key => $value) {
                $parser->cambiar($key, $value);
            }

            $parser->print();
        } catch (Throwable $exc) {
            utils::api_error_exception("Excepcion interna ocurrida", "c/qr:captura", $exc);
        }
    }

    public function api_listarpuntosinsectos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $local_id = htmlentities($datos['local_id']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_puntos_insectos', [$local_id]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarpuntos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $local_id = htmlentities($datos['local_id']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_puntos', [$local_id]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarConsumoInsectosMesAll()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $local_id = htmlentities($datos['local_id']);
            $month = htmlentities($datos['month']);
            $year = htmlentities($datos['year']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_consumos_insectos_mes_all', [$local_id, $month, $year]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_statsDataInsectos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $local_id = htmlentities($datos['local_id']);
            $year = htmlentities($datos['year']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('stats_insectos_totales_almes', [$local_id, $year]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarConsumoMesAll()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $local_id = htmlentities($datos['local_id']);
            $month = htmlentities($datos['month']);
            $year = htmlentities($datos['year']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_consumos_mes_all', [$local_id, $month, $year]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarConsumoMes()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);
            $month = htmlentities($datos['month']);
            $year = htmlentities($datos['year']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_consumos_mes', [$punto_id, $month, $year]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_buscarPuntoInsectos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_punto_insectos', [$punto_id]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_buscarPunto()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_punto', [$punto_id]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarConsumosInsectos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);
            $fecha1 = htmlentities($datos['fecha1']);
            $fecha2 = htmlentities($datos['fecha2']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_consumos_insectos', [$punto_id, $fecha1, $fecha2]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarConsumos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);
            $fecha1 = htmlentities($datos['fecha1']);
            $fecha2 = htmlentities($datos['fecha2']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_consumos', [$punto_id, $fecha1, $fecha2]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    private function buscar_constancia($constancia)
    {
        try {
            if (strlen(trim($constancia)) === 0) {
                return null;
            } else {

                $bd = bd::getInstance();
                $sp = $bd->store_procedure('buscar_visita_constancia', [$constancia]);

                return ($sp[0]['resultado'] == '0' ? null : $sp[0]['VISITA_ID']);
            }
        } catch (Throwable $exc) {
            return null;
        }
    }

    public function api_registrarConsumoInsectos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);
            $operario_id = htmlentities($datos['operario_id']);
            $deterioro = htmlentities($datos["deterioro"]);
            $recambio = htmlentities($datos["recambio"]);
            $lepidopteros = htmlentities($datos["lepidopteros"]);
            $microlepidopteros = htmlentities($datos["microlepidopteros"]);
            $hemipteros = htmlentities($datos["hemipteros"]);
            $coleopteros = htmlentities($datos["coleopteros"]);
            $moscas = htmlentities($datos["moscas"]);
            $mosquitos = htmlentities($datos["mosquitos"]);
            $otros = htmlentities($datos["otros"]);

            $visita_id = $this->buscar_constancia(htmlentities($datos['visita']));

            $observaciones = (strlen(trim($datos["observaciones"])) === 0 ? null : htmlentities($datos['observaciones']));
            $lat = (strlen(trim($datos["lat"])) === 0 ? null : htmlentities($datos['lat']));
            $long = (strlen(trim($datos["long"])) === 0 ? null : htmlentities($datos['long']));

            $param = [$punto_id, $visita_id, $operario_id, $deterioro, $recambio, $lepidopteros, $microlepidopteros,
                $hemipteros, $coleopteros, $moscas, $mosquitos, $otros, $observaciones, $lat, $long];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_punto_insectos_historial', $param);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarConsumo()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $punto_id = htmlentities($datos['punto_id']);
            $operario_id = htmlentities($datos['operario_id']);
            $hubo_consumo = htmlentities($datos['hubo_consumo']);
            $medida_inicial = htmlentities($datos['medida_inicial']);
            $medida = htmlentities($datos['medida']);
            $recambio = htmlentities($datos['recambio']);
            $visita_id = $this->buscar_constancia(htmlentities($datos['visita']));

            $observaciones = (strlen(trim($datos["observaciones"])) === 0 ? null : htmlentities($datos['observaciones']));
            $lat = (strlen(trim($datos["lat"])) === 0 ? null : htmlentities($datos['lat']));
            $long = (strlen(trim($datos["long"])) === 0 ? null : htmlentities($datos['long']));

            $param = [
                $punto_id,
                $hubo_consumo,
                $medida_inicial,
                $medida,
                $visita_id,
                $operario_id,
                $recambio,
                $observaciones,
                $lat,
                $long
            ];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_punto_historial', $param);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 0, 'mensaje' => 'Excepcion interna ocurrida', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_servicioPunto()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $codigo_unico = htmlentities($datos['codigo_unico_visita']);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_consumos_visita_cu', [$codigo_unico]);

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            utils::api_error_exception("Excepcion interna ocurrida retornando datos de servicio y puntos de control", "qr:api_servicioPunto", $exc);
        }
    }

    private function buscar_servicio($cu)
    {
        try {
            if (strlen(trim($cu)) === 0) {
                return null;
            } else {

                $bd = bd::getInstance();
                $sp = $bd->store_procedure('obtener_visita_codigounico', [$cu]);

                return ($sp[0]['resultado'] == '0' ? null : $sp[0]['VISITA_ID']);
            }
        } catch (Throwable $exc) {
            return null;
        }
    }

    public function api_editarConsumoPC()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $c = count($datos);

            $bd = bd::getInstance();
            $respuestas = [];
            $user = sesion::info_sesion();

            for ($i = 0; $i < $c; $i++) {
                $hubo_consumo = ( $datos[$i]['medidaInicial'] == 0 && $datos[$i]['medidaActual'] == 0 ? 0 : 1);
                $visita_id = $this->buscar_servicio($datos[$i]['visita_cu']);
                $params = [
                    $datos[$i]['phid'],
                    $hubo_consumo,
                    $datos[$i]['medidaInicial'],
                    $datos[$i]['medidaActual'],
                    $user['info_usuario']['USUARIO_ID'],
                    $datos[$i]['recambio'],
                    $datos[$i]['observacion']
                ];
                $sp = $bd->store_procedure('editar_punto_historial_PC', $params);
                array_push($respuestas, $sp);
            }

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'respuestas' => $respuestas]);
            die();
        } catch (Throwable $exc) {
            utils::api_error_exception("Excepcion interna ocurrida editando datos de consumo", "qr:api_registrarConsumoPC", $exc);
        }
    }

    public function api_registrarConsumoPC()
    {
        $this->security_api(1);
        try {
            //Esto recibe un array de varios valores a la vez
            $datos = json_decode(file_get_contents('php://input'), true);
            $c = count($datos);

            $bd = bd::getInstance();
            $respuestas = [];
            $user = sesion::info_sesion();

            for ($i = 0; $i < $c; $i++) {
                $hubo_consumo = ( $datos[$i]['medidaInicial'] == 0 && $datos[$i]['medidaActual'] == 0 ? 0 : 1);
                $visita_id = $this->buscar_servicio($datos[$i]['visita_cu']);
                $params = [
                    $datos[$i]['id'],
                    $hubo_consumo,
                    $datos[$i]['medidaInicial'],
                    $datos[$i]['medidaActual'],
                    $visita_id,
                    $user['info_usuario']['USUARIO_ID'],
                    $datos[$i]['recambio'],
                    $datos[$i]['observacion']
                ];
                $sp = $bd->store_procedure('registrar_punto_historial_PC', $params);
                array_push($respuestas, $sp);
            }

            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'respuestas' => $respuestas]);
            die();
        } catch (Throwable $exc) {
            utils::api_error_exception("Excepcion interna ocurrida recogiendo datos de consumo", "qr:api_registrarConsumoPC", $exc);
        }
    }
}
