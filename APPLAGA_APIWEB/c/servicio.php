<?php

class servicio extends panel implements controlador
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

    //----- FUNCIONES DE API
    public function api_listarclientes()
    {
        $this->security_api(1);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('listar_clientes_all', []);
        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_listarlocales()
    {
        $this->security_api(1);
        $bd = bd::getInstance();

        $datos = json_decode(file_get_contents('php://input'), true);
        $cliente_id = htmlentities($datos['cliente_id']);

        if (strlen($cliente_id) == 0 or !is_numeric($cliente_id)) {
            logger::log("Intento de acceso con parametros incorrectos en /servicio/api_listarlocales", "c/servicio.php:api_listarlocales");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'parametros incorrectos de consulta']);
            die();
        }

        $sp = $bd->store_procedure('listar_locales_cliente', [$cliente_id]);
        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_listarvisitas()
    {
        $this->security_api(1);
        try {
            $bd = bd::getInstance();

            $datos = json_decode(file_get_contents('php://input'), true);
            $cliente_id = htmlentities($datos['cliente_id']);
            $local_id = htmlentities($datos['local_id']);
            $finicio = htmlentities($datos['finicio']);
            $ffin = htmlentities($datos['ffin']);

            if (strlen($cliente_id) == 0 or strlen($local_id) == 0 or strlen($finicio) == 0 or strlen($ffin) == 0) {
                logger::log("Intento de acceso con parametros incorrectos en /servicio/api_listarvisitas", "c/servicio.php:api_listarvisitas");
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 0, 'mensaje' => 'parametros incorrectos de consulta']);
                die();
            }

            $sp = $bd->store_procedure('buscar_visita', [$cliente_id, $local_id, $finicio, $ffin]);
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            logger::log("Error en la solicitud de servicios. {$exc->getMessage()}", "c/servicio.php:api_listarvisitas");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarvisitas_constancia_exacta()
    {
        $this->security_api(1);
        try {
            $bd = bd::getInstance();

            $datos = json_decode(file_get_contents('php://input'), true);
            $termino = htmlentities($datos['termino']);

            $sp = $bd->store_procedure('buscar_visita_constancia_exacta', [$termino]);
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            logger::log("Error en la solicitud de servicios por constancia. {$exc->getMessage()}", "c/servicio.php:api_listarvisitas_constancia_exacta");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarvisitas_constancia()
    {
        $this->security_api(1);
        try {
            $bd = bd::getInstance();

            $datos = json_decode(file_get_contents('php://input'), true);
            $termino = htmlentities($datos['termino']);

            $sp = $bd->store_procedure('buscar_visita_constancia', [$termino]);
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            logger::log("Error en la solicitud de servicios por constancia. {$exc->getMessage()}", "c/servicio.php:api_listarvisitas_constancia");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarOperarios()
    {
        $this->security_api(1);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('buscar_opcampo', []);
        header('Content-Type: application/json');
        echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_editarEquipo()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $id = htmlentities($datos["id"]);
            $nombre = htmlentities($datos["nombre"]);
            $descripcion = htmlentities($datos["descripcion"]);
            $fichatecnica = htmlentities($datos["fichatecnica"]);

            $param = [
                $id,
                $nombre,
                utils::cadenavacia($descripcion),
                utils::cadenavacia($fichatecnica)
            ];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('editar_equipo', $param);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            logger::log("Error en la edici&oacute;n de producto. {$exc->getMessage()}", "c/servicio.php:api_editarEquipo");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_editarProducto()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $id = htmlentities($datos["id"]);
            $nombre = htmlentities($datos["nombre"]);
            $nombrecomercial = htmlentities($datos["nombrecomercial"]);
            $ingredienteactivo = htmlentities($datos["ingredienteactivo"]);
            $descripcion = htmlentities($datos["descripcion"]);
            $fichatecnica = htmlentities($datos["fichatecnica"]);

            $param = [
                $id,
                $nombre,
                utils::cadenavacia($nombrecomercial),
                utils::cadenavacia($ingredienteactivo),
                utils::cadenavacia($descripcion),
                utils::cadenavacia($fichatecnica)
            ];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('editar_producto', $param);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            logger::log("Error en la edici&oacute;n de producto. {$exc->getMessage()}", "c/servicio.php:api_editarProducto");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarEquipo()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $nombre = htmlentities($datos["nombre"]);
            $descripcion = htmlentities($datos["descripcion"]);
            $fichatecnica = htmlentities($datos["fichatecnica"]);

            $param = [
                $nombre,
                utils::cadenavacia($descripcion),
                utils::cadenavacia($fichatecnica)
            ];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_equipo', $param);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en el registro de producto. {$exc->getMessage()}", "c/servicio.php:api_registrarEquipo");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarProducto()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $nombre = htmlentities($datos["nombre"]);
            $nombrecomercial = htmlentities($datos["nombrecomercial"]);
            $ingredienteactivo = htmlentities($datos["ingredienteactivo"]);
            $descripcion = htmlentities($datos["descripcion"]);
            $fichatecnica = htmlentities($datos["fichatecnica"]);

            $param = [
                $nombre,
                utils::cadenavacia($nombrecomercial),
                utils::cadenavacia($ingredienteactivo),
                utils::cadenavacia($descripcion),
                utils::cadenavacia($fichatecnica)
            ];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_producto', $param);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en el registro de producto. {$exc->getMessage()}", "c/servicio.php:api_registrarProducto");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_editarServicio()
    {
        $this->security_api(1);

        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $visita_id = htmlentities($datos["visita_id"]);
            $cliente_id = htmlentities($datos["cliente_id"]);
            $local_id = htmlentities($datos['local_id']);
            $responsable = htmlentities($datos['responsable']);
            $cargo_responsable = htmlentities($datos['cargo_responsable']);
            $n_constancia = htmlentities($datos['n_constancia']);
            $inicio = htmlentities($datos['inicio']);
            $fin = htmlentities($datos['fin']);
            $n_certificado = htmlentities($datos['n_certificado']);
            $vencimiento_certificado = htmlentities($datos['vencimiento_certificado']);
            $obs_reco = htmlentities($datos['obs_reco']);
            $obs_cli = htmlentities($datos['obs_cli']);
            $cond_int = htmlentities($datos['cond_int']);
            $cond_ext = htmlentities($datos['cond_ext']);
            $visto_bueno = htmlentities($datos['visto_bueno']);

            $parametros = [$visita_id, $local_id, utils::cadenavacia($responsable), utils::cadenavacia($cargo_responsable),
                $n_constancia, $inicio, $fin, utils::cadenavacia($n_certificado), utils::cadenavacia($vencimiento_certificado),
                utils::cadenavacia($obs_reco), utils::cadenavacia($obs_cli),
                $cond_int, $cond_ext, $visto_bueno];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('editar_visita', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en el registro de servicio. {$exc->getMessage()}", "c/servicio.php:api_editarServicio");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarServicio()
    {
        $this->security_api(1);

        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $cliente_id = htmlentities($datos["cliente_id"]);
            $local_id = htmlentities($datos['local_id']);
            $responsable = htmlentities($datos['responsable']);
            $cargo_responsable = htmlentities($datos['cargo_responsable']);
            $n_constancia = htmlentities($datos['n_constancia']);
            $inicio = htmlentities($datos['inicio']);
            $fin = htmlentities($datos['fin']);
            $n_certificado = htmlentities($datos['n_certificado']);
            $vencimiento_certificado = htmlentities($datos['vencimiento_certificado']);
            $obs_reco = htmlentities($datos['obs_reco']);
            $obs_cli = htmlentities($datos['obs_cli']);
            $cond_int = htmlentities($datos['cond_int']);
            $cond_ext = htmlentities($datos['cond_ext']);
            $visto_bueno = htmlentities($datos['visto_bueno']);

            $parametros = [$local_id, utils::cadenavacia($responsable), utils::cadenavacia($cargo_responsable),
                $n_constancia, $inicio, $fin, utils::cadenavacia($n_certificado), utils::cadenavacia($vencimiento_certificado),
                utils::cadenavacia($obs_reco), utils::cadenavacia($obs_cli),
                $cond_int, $cond_ext, $visto_bueno];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_visita', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en el registro de servicio. {$exc->getMessage()}", "c/servicio.php:api_registrarServicio");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarServicio_Operarios()
    {
        $this->security_api(1);

        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $visita_id = htmlentities($datos['visita_id']);
            $operarios = htmlentities($datos["op"]); //lista concatenada
            $supervisores = htmlentities($datos['s']); //lista concatenada

            $lista_operarios = explode(',', $operarios);
            $lista_supervisores = explode(',', $supervisores);

            $c_op = count($lista_operarios);

            $bd = bd::getInstance();
            $array_respuestas = [];

            for ($i = 0; $i < $c_op; $i++) {
                $super = (in_array($lista_operarios[$i], $lista_supervisores)) ? 1 : 0;
                $param = [$visita_id, $lista_operarios[$i], $super];
                $array_respuestas[] = $bd->store_procedure('registrar_visita_operarios', $param);
            }

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $array_respuestas]);
            die();
        } catch (Exception $exc) {
            logger::log("Error en el registro de operarios. {$exc->getMessage()}", "c/servicio.php:api_registrarServicio_Operarios");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarServicio_Equipos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $visita_id = htmlentities($datos["visita_id"]);
            $equipos = htmlentities($datos["equipos"]);

            $s_equipos = explode(',', $equipos);
            $c_equipos = count($s_equipos);

            $bd = bd::getInstance();
            $array_respuestas = [];

            for ($i = 0; $i < $c_equipos; $i++) {
                $param = [$visita_id, $s_equipos[$i], null, null];
                $array_respuestas = $bd->store_procedure('registrar_visita_equipo', $param);
            }

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $array_respuestas]);
            die();
        } catch (Throwable $e) {
            logger::log("Error en el registro de productos. {$exc->getMessage()}", "c/servicio.php:api_registrarServicio_Equipos");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $e->getMessage()]);
            die();
        }
    }

    public function api_registrarServicio_Productos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $visita_id = htmlentities($datos["visita_id"]);
            $productos = htmlentities($datos["productos"]);

            $s_productos = explode(',', $productos);
            $c_productos = count($s_productos);

            $bd = bd::getInstance();
            $array_respuestas = [];

            for ($i = 0; $i < $c_productos; $i++) {
                $param = [$visita_id, $s_productos[$i], null, null];
                $array_respuestas = $bd->store_procedure('registrar_visita_producto', $param);
            }

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $array_respuestas]);
            die();
        } catch (Throwable $e) {
            logger::log("Error en el registro de productos. {$exc->getMessage()}", "c/servicio.php:api_registrarServicio_Productos");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $e->getMessage()]);
            die();
        }
    }

    public function api_registrarServicio_TipoServicios()
    {
        $this->security_api(1);

        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $visita_id = htmlentities($datos["visita_id"]);
            $servicios = htmlentities($datos["servicios"]);

            $s_servicios = explode(',', $servicios);
            $c_servicios = count($s_servicios);

            $bd = bd::getInstance();
            $array_respuestas = [];

            for ($i = 0; $i < $c_servicios; $i++) {
                $param = [$visita_id, $s_servicios[$i]];
                $array_respuestas = $bd->store_procedure('registrar_visita_servicio', $param);
            }

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $array_respuestas]);
            die();
        } catch (Throwable $e) {
            logger::log("Error en el registro de tipo de servicio. {$exc->getMessage()}", "c/servicio.php:api_registrarServicio_TipoServicios");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $e->getMessage()]);
            die();
        }
    }

    public function api_listartiposdeservicio()
    {
        $this->security_api(1);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('buscar_tiposervicios', []);
        header('Content-Type: application/json');
        echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_listarproductos()
    {
        $this->security_api(1);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('buscar_productos', []);
        header('Content-Type: application/json');
        echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_listarequipos()
    {
        $this->security_api(1);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('buscar_equipos', []);
        header('Content-Type: application/json');
        echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_listararchivos()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $visita_id = htmlentities($datos["visita_id"]);
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_visita_documento', [$visita_id]);
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            
        }
    }

    //--------------- APIS CLIENTE ------------------------------------

    public function api_cliente_listararchivos()
    {
        $this->security_api('cliente');
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $visita_id = htmlentities($datos["visita_id"]);

            $info_sesion = sesion::info_sesion();
            $cliente_username = $info_sesion['info_sesion']['USUARIO'];

            if ($this->security_cliente_access($cliente_username, $visita_id)) {
                $bd = bd::getInstance();
                $sp = $bd->store_procedure('obtener_visita_documento', [$visita_id]);
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
                die();
            } else {
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 0, 'mensaje' => 'Este cliente no tiene acceso a este servicio']);
                die();
            }
        } catch (Throwable $exc) {
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error interno listando archivos', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_cliente_listar_servicios()
    {
        $this->security_api("cliente");
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $local_id = htmlentities($datos["local_id"]);
            $inicio = htmlentities($datos["inicio"]);
            $fin = htmlentities($datos["fin"]);

            $bd = bd::getInstance();

            //el id de cliente hay que sacarlo desde backend
            $info_sesion = sesion::info_sesion();
            $cliente_id = $info_sesion['info_usuario']['CLIENTE_ID'];

            $sp = $bd->store_procedure('buscar_visita', [$cliente_id, $local_id, $inicio, $fin]);
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            
        }
    }

    public function api_borrarProducto()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $producto_id = htmlentities($datos["producto_id"]);

            $parametros = [$producto_id];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('desactivar_producto', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en el borrado de un producto. {$exc->getMessage()}", "c/servicio.php:api_borrarProducto");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_borrarEquipo()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $equipo_id = htmlentities($datos["equipo_id"]);

            $parametros = [$equipo_id];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('desactivar_equipo', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en el borrado de un equipo. {$exc->getMessage()}", "c/servicio.php:api_borrarEquipo");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_borrarServicio()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);

            $visita_id = htmlentities($datos["id"]);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('desactivar_visita', [$visita_id]);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Exception $exc) {
            utils::api_error_exception("Error en el borrado de un servicio/visita", "c/servicio.php:api_borrarServicio", $exc);
        }
    }


}
