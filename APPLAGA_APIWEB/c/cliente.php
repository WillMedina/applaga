<?php

class cliente extends panel implements controlador
{

    private $parametros;
    private $applaga;
    private $info_cliente_logueado = [];

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

    private function datos_cliente_logueado()
    {
        if (!sesion::existe_sesion()) {
            $this->info_cliente_logueado['VALIDO'] = false;
            return false;
        }

        $info_sesion = sesion::info_sesion();
        if ($info_sesion['info_sesion']['TIPO'] != 'cliente') {
            $this->info_cliente_logueado['VALIDO'] = false;
            return false;
        }

        $this->info_cliente_logueado['VALIDO'] = true;
        $this->info_cliente_logueado['CLIENTE_ID'] = $info_sesion['info_usuario']['CLIENTE_ID'];
        $username = $info_sesion['info_usuario']['USUARIO'];

        $bd = bd::getInstance();
        $sp = $bd->store_procedure('cliente_acceso', [$username]);

        $this->info_cliente_logueado['ACCESO_LOCALES'] = $sp[0]['LOCAL_ID_ACCESO'];
        return true;
    }

    public function api_listarclientes_all()
    {
        $this->security_api(1);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('listar_clientes_all', []);

        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_borrarlocal()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $local_id = htmlentities($datos["local_id"]);

            $parametros = [$local_id];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('desactivar_local', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en la edicion de un cliente. {$exc->getMessage()}", "c/cliente.php:api_borrarlocal");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_borrarcliente()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $cliente_id = htmlentities($datos["cliente_id"]);

            $parametros = [$cliente_id];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('desactivar_cliente', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en la edicion de un cliente. {$exc->getMessage()}", "c/cliente.php:api_borrarcliente");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarlocal()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $cliente_id = htmlentities($datos["cliente_id"]);
            $nombreclave = htmlentities($datos["nombreclave"]);
            $direccion = htmlentities($datos["direccion"]);
            $frecuencia_servicio = htmlentities($datos["frecuencia_servicio"]);
            $telefono = htmlentities($datos["telefono"]);
            $email = htmlentities($datos["email"]);

            $parametros = [$cliente_id, $nombreclave, $direccion, $frecuencia_servicio, $telefono, $email];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_local', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en la edicion de un cliente. {$exc->getMessage()}", "c/cliente.php:api_registrarcliente");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_registrarcliente()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $nombreclave = htmlentities($datos["nombreclave"]);
            $razonsocial = htmlentities($datos["razonsocial"]);
            $ruc = htmlentities($datos["ruc"]);

            $parametros = [$nombreclave, $razonsocial, $ruc];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_cliente', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en la edicion de un cliente. {$exc->getMessage()}", "c/cliente.php:api_registrarcliente");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_editarlocal()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $local_id = htmlentities($datos["local_id"]);
            $nombreclave = htmlentities($datos["nombreclave"]);
            $direccion = htmlentities($datos["direccion"]);
            $frecuencia_servicio = htmlentities($datos["frecuencia_servicio"]);
            $telefono = htmlentities($datos["telefono"]);
            $email = htmlentities($datos["email"]);

            $parametros = [$local_id, $nombreclave, $direccion, $frecuencia_servicio, $telefono, $email];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('editar_local', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en la edicion de un cliente. {$exc->getMessage()}", "c/cliente.php:api_editarlocal");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_editarcliente()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $cliente_id = htmlentities($datos["cliente_id"]);
            $nombreclave = htmlentities($datos["nombreclave"]);
            $razonsocial = htmlentities($datos["razonsocial"]);
            $ruc = htmlentities($datos["ruc"]);

            $parametros = [$cliente_id, $nombreclave, $razonsocial, $ruc];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('editar_cliente', $parametros);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            logger::log("Error en la edicion de un cliente. {$exc->getMessage()}", "c/cliente.php:api_editarcliente");
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => 'Error', 'Excepcion' => $exc->getMessage()]);
            die();
        }
    }

    public function api_listarlocales_admin()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $cliente_id = htmlentities($datos["cliente_id"]);

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('listar_locales_cliente', [$cliente_id]);
            header('Content-Type: application/json');
            echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
            die();
        } catch (Throwable $exc) {
            echo json_encode(["resultado" => 0, 'mensaje' => 'Error interno ocurrido (excepcion)', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }

    //esta api lista los locales a los que el usuario tiene acceso
    public function api_listarlocales()
    {
        $this->security_api('cliente');
        $this->datos_cliente_logueado();
        try {
            if ($this->info_cliente_logueado['VALIDO']) {
                $bd = bd::getInstance();
                $sp = null;
                if ($this->info_cliente_logueado["ACCESO_LOCALES"] == "0") {
                    //si es cero tiene acceso a todos
                    $cliente_id = $this->info_cliente_logueado['CLIENTE_ID'];
                    $sp = $bd->store_procedure('listar_locales_cliente', [$cliente_id]);
                } else {
                    $local_id = $this->info_cliente_logueado["ACCESO_LOCALES"];
                    $sp = $bd->store_procedure('obtener_local', [$local_id]);
                }

                header('Content-Type: application/json');
                echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
                die();
            } else {
                header('Content-Type: application/json');
                echo json_encode(["resultado" => 0, 'mensaje' => 'Error interno validando a este usuario con su dato de cliente']);
                die();
            }
        } catch (Throwable $exc) {
            echo json_encode(["resultado" => 0, 'mensaje' => 'Error interno ocurrido (excepcion)', 'excepcion' => $exc->getMessage()]);
            die();
        }
    }
}
