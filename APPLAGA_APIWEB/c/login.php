<?php

class login implements controlador
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
        if (sesion::existe_sesion()) {
            utils::redireccion($this->applaga::URL . '/panel');
        }

        //todo
        $url_theme = $this->applaga::URL . '/v/' . $this->applaga::DEFULT_THEME;
        $template = $this->applaga::FOLDER . '/v/' . $this->applaga::DEFULT_THEME . '/html/login.html';
        $parser = new parserHTML($template);

        $cambios = [
            '{URL}' => $this->applaga::URL,
            '{URL_THEME}' => $url_theme,
            '{YEAR}' => date('Y')
        ];

        foreach ($cambios as $key => $value) {
            $parser->cambiar($key, $value);
        }

        //var_dump($parser->print(true), $template, $url_theme);
        header('Content-Type: text/html');
        $parser->print();
    }

    public function c_logout()
    {
        if (sesion::existe_sesion()) {
            sesion::cerrar_sesion($_COOKIE["hash_sesion"]);
        }

        $loc = $this->applaga::URL;
        header("Location: $loc");
        die();
    }

    public function c_logout_api()
    {
        if (sesion::existe_sesion()) {
            sesion::cerrar_sesion($_COOKIE[modelo::COOKIE_DATA['name']]);
        }

        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, "mensaje" => 'Cualquier sesi&oacute;n activa ha sido cerrada en este navegador']);
        die();
    }

    public function api_datosusuario()
    {
        header('Content-Type: application/json');
        if (sesion::existe_sesion()) {

            $bd = bd::getInstance();

            $datos = json_decode(file_get_contents('php://input'), true);
            $usuario = htmlentities($datos['usuario']);

            echo json_encode(["resultado" => 1, 'mensaje' => 'OK', 'datos' => sesion::info_sesion_id($usuario)]);
            die();
        } else {
            echo json_encode(["resultado" => 0, "mensaje" => "No autorizado"]);
        }
    }

    public function debug_infosesion()
    {
        $infosesion = [];

        if (is_null(sesion::info_sesion())) {
            $infosesion["resultado"] = 0;
            $infosesion["mensaje"] = "No existe sesion autenticada";
            $infosesion["datos"] = [];
        } else {
            $infosesion["resultado"] = 1;
            $infosesion["mensaje"] = "OK";
            $infosesion["datos"] = sesion::info_sesion();
        }

        header('Content-Type: application/json');
        echo json_encode($infosesion);
    }

    public function api_notificaciones()
    {
        header('Content-Type: application/json');
        /*
          if (!sesion::existe_sesion()) {
          echo json_encode(
          [
          "resultado" => 0,
          "mensaje" => 'Debe existir una sesion vigente'
          ]
          );
          die();
          }
         */


        $resultado = [];
        $datos = json_decode(file_get_contents('php://input'), true);

        $info = sesion::info_sesion_id($datos["usuario"]);

        if ($info["TIPO"] != 'CLIENTE') {
            $resultado["resultado"] = '0';
            $resultado["mensaje"] = 'Debe estar logueado un cliente';
            echo json_encode($resultado);
            die();
        }

        /** EXPERIMENTAL --- CAMBIAR LUEGO */
        $usuario = $info["USUARIO"]; // Nombre de usuario placeholder
        $random = mt_rand(1, 100); // Genera un número aleatorio entre 1 y 100

        if ($random <= 50) {
            // 50% de probabilidad
            $titulo = "No hay notificaciones";
            $mensaje = "El usuario $usuario no tiene notificaciones.";
        } elseif ($random <= 75) {
            // 25% de probabilidad
            $titulo = "1 notificación";
            $mensaje = "El usuario ha recibido una notificación.";
        } else {
            // 25% de probabilidad restante
            $cantidadNotificaciones = mt_rand(2, 50); // Genera un número aleatorio entre 2 y 50
            $titulo = "$cantidadNotificaciones notificaciones";
            $mensaje = "El usuario $usuario tiene $cantidadNotificaciones notificaciones.";
        }

        $resultado["resultado"] = '1';
        $resultadp["timestamp"] = date('Y-m-d h:i:s');
        $resultado["CLIENTE_CONECTADO"] = $info;
        $resultado["titulo"] = $titulo;
        $resultado["mensaje"] = $mensaje;
        //return ["titulo" => $titulo, "mensaje" => $mensaje];
        echo json_encode($resultado);
        die();
        /*         * ** EXPERIMENTAL --- CAMBIAR LUEGO */
    }

    public function c_login()
    {
        //esto es un link de api : login/c_login
        header('Content-Type: application/json');

        if (sesion::existe_sesion()) {
            echo json_encode(
                    [
                        "resultado" => 0,
                        "mensaje" => 'La sesion ya existe'
                    ]
            );
            die();
        }

        try {
            // GRACIAS CHATGPT --------------------------------------------
            $datos = json_decode(file_get_contents('php://input'), true);

            $usuario = htmlentities($datos['usuario']);
            $pass = htmlentities($datos['pass']);
            // GRACIAS CHATGPT --------------------------------------------


            $bd = bd::getInstance();
            $logins = $bd->store_procedure('buscar_login', [$usuario]);

            if ($logins[0]['resultado'] != "1") {
                //si es diferente de 1 puede devolver 0 o un error de SP
                echo json_encode(
                        [
                            "resultado" => $logins[0]['resultado'],
                            "mensaje" => $logins[0]['mensaje'],
                            "usuario" => $usuario,
                            "pass" => $pass
                        ]
                );
            } else {
                //en teoria el usuario es unico asi que siempre devolvera un solo registro
                $comprobado = utils::verificarHash($pass, $logins[0]['HASH']);

                if ($comprobado) {
                    $login_id = $logins[0]['LOGIN_ID'];
                    sesion::crear_sesion($login_id);
                    echo json_encode(
                            [
                                "resultado" => 1,
                                "datos" => sesion::info_sesion_id($usuario),
                                "mensaje" => 'El usuario ha sido correctamente autenticado'
                            ]
                    );
                } else {
                    echo json_encode(
                            [
                                "resultado" => 0,
                                "datos" => [],
                                "mensaje" => 'Error en la autenticaci&oacute;n'
                            ]
                    );
                }
            }

            die();
        } catch (Throwable $e) {
            utils::api_error_exception("Error interno ocurrido en el uso del API de login. ", 'c/login:c_login', $e);
        }
    }
}
