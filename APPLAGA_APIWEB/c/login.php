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
            sesion::cerrar_sesion($_COOKIE["hash_sesion"]);
        }

        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, "mensaje" => 'Cualquier sesi&oacute;n activa ha sido cerrada en este navegador']);
        die();
    }

    public function c_login()
    {
        //esto es un link de api : login/c_login
        header('Content-Type: application/json');

        if (sesion::existe_sesion()) {
            echo json_encode(["resultado" => 0, "mensaje" => 'sesion existente']);
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
                    sesion::crear_sesion($logins[0]['LOGIN_ID']);
                    echo json_encode(["resultado" => 1, "mensaje" => 'El usuario ha sido correctamente autenticado']);
                } else {
                    echo json_encode(["resultado" => 0, "mensaje" => 'Error en la autenticaci&oacute;n']);
                }
            }

            die();
        } catch (Throwable $e) {
            utils::api_error_exception("Error interno ocurrido en el uso del API de login. ", 'c/login:c_login', $e);
        }
    }
}
