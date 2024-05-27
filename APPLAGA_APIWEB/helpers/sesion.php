<?php

//archivo encargado de manejar la sesion de usuario
class sesion
{

    static function crear_sesion($login_id)
    {
        try {
            $usuario = utils::obtener_browser_cliente(); //se obtiene la data del browser
            $token = utils::get_pseudotoken(); //seudotoken

            $cookie_value = $token;
            $expire = time() + (10 * 365 * 24 * 60 * 60); // tiempo de expiración en 10 años (aproximadamente)

            setcookie(modelo::COOKIE_DATA['name'], $cookie_value,
                    [
                        'expires' => $expire,
                        'path' => modelo::COOKIE_DATA['path'],
                        'domain' => modelo::URL_CLEAN,
                        'secure' => modelo::COOKIE_DATA['secure'],
                        'httponly' => modelo::COOKIE_DATA['httponly'],
                        'samesite' => modelo::COOKIE_DATA['samesite']
                    ]
            );

            $bd = bd::getInstance();
            $bd->store_procedure('crear_sesion', [$login_id, $usuario["ip"], $usuario["browser"], $token]);
            return true;
        } catch (Throwable $exc) {
            //echo $exc->getTraceAsString();
            logger::log("Error interno desconocido en la creaci&oacute;n de cookies." . $exc->getMessage(), 'helpers/sesion:crear_sesion');
            return false;
        }
    }

    static function info_sesion_id($login_username)
    {
        try {
            $bd = bd::getInstance();
            $listar_datos = $bd->store_procedure('buscar_login', [$login_username]);

            if ($listar_datos[0]["resultado"] == "0") {
                return null;
            } else {
                $tipousuario = (($listar_datos[0]["TABLA"] == "cliente") ? "CLIENTE" : $listar_datos[0]["TIPOUSUARIO"]);
                return [
                    "LOGIN_ID" => $listar_datos[0]["resultado"],
                    "USUARIO" => $listar_datos[0]["USUARIO"],
                    "TIPO" => $tipousuario,
                ];

                /* TODO: TRATAR DE TRAER ESTO:
                 * "SESION_ID" => ,
                  "LOGIN_ID" => ,
                  "USUARIO" => ,
                  "TIPO" => ,
                  "FINICIO" => ,
                  "TIEMPO_TRANSCURRIDO" => ,
                  "COOKIE" => ,
                  "IP" => ,
                  "BROWSER" =>
                 */
            }
        } catch (Throwable $exc) {
            logger::log("Error interno obteniendo datos del usuario. " . $login_username . " Excepcion: " . $exc->getMessage(),
                    'sesion:info_sesion_id');
            return null;
        }
    }

    static function info_sesion()
    {
        if (self::existe_sesion()) {
            try {
                $bd = bd::getInstance();
                $listar_sesiones = $bd->store_procedure('listar_sesion_cookie', [$_COOKIE[modelo::COOKIE_DATA['name']]]);

                if ($listar_sesiones[0]['resultado'] == '0') {
                    return null;
                } else {
                    $info_login = $bd->store_procedure('buscar_login', [$listar_sesiones[0]['USUARIO']]);
                    $sesion = [
                        'info_sesion' => $listar_sesiones[0],
                        'info_usuario' => $info_login[0]
                    ];

                    return $sesion;
                }
            } catch (Throwable $e) {
                logger::log("Error interno obteniendo datos de la sesion. " . $e->getMessage(), 'sesion:info_sesion');
            }
        } else {
            return null;
        }
    }

    static function existe_sesion()
    {
        if (isset($_COOKIE[modelo::COOKIE_DATA['name']])) {

            $bd = bd::getInstance();
            $listar_sesiones = $bd->store_procedure('listar_sesion_cookie', [$_COOKIE[modelo::COOKIE_DATA['name']]]);
            if ($listar_sesiones[0]['resultado'] == '0') {
                setcookie(modelo::COOKIE_DATA['name'], '',
                        [
                            'expires' => time() - 3600,
                            'path' => modelo::COOKIE_DATA['path'],
                            'domain' => modelo::URL_CLEAN,
                            'secure' => modelo::COOKIE_DATA['secure'],
                            'httponly' => modelo::COOKIE_DATA['httponly'],
                            'samesite' => modelo::COOKIE_DATA['samesite']
                ]);
                return false;
            } else {
                //Revisar luego si cookie = IP o cookie = browser
                $usuario = utils::obtener_browser_cliente();
                //if ($usuario['ip'] == $listar_sesiones[0]['IP'] AND $usuario['browser'] == $listar_sesiones[0]['BROWSER']) {
                if ($usuario['browser'] == $listar_sesiones[0]['BROWSER']) {
                    //todo en orden
                    return true;
                } else {
                    logger::log("Error en el match de sesion: {$usuario["ip"]}, se cambio la marca de browser: {$usuario["browser"]} en la sesion {$_COOKIE[modelo::COOKIE_DATA['name']]}",
                            'helpers/sesion:existe_sesion_sesion');
                    return false;
                }
            }
        } else {
            //borrar la cookie por si acaso
            if (isset($_COOKIE[modelo::COOKIE_DATA['name']])) {
                setcookie(modelo::COOKIE_DATA['name'], '',
                        [
                            'expires' => time() - 3600,
                            'path' => modelo::COOKIE_DATA['path'],
                            'domain' => modelo::URL_CLEAN,
                            'secure' => modelo::COOKIE_DATA['secure'],
                            'httponly' => modelo::COOKIE_DATA['httponly'],
                            'samesite' => modelo::COOKIE_DATA['samesite']
                ]);
            }
            return false;
        }
    }

    static function cerrar_sesion($hash_cookie)
    {
        $bd = bd::getInstance();
        $cerrar_sesion = $bd->store_procedure('cerrar_sesion_cookie', [$hash_cookie]);
        if (isset($_COOKIE[modelo::COOKIE_DATA['name']]) and $_COOKIE[modelo::COOKIE_DATA['name']] == $hash_cookie) {
            setcookie(
                    modelo::COOKIE_DATA['name'],
                    '',
                    [
                        'expires' => time() - 3600,
                        'path' => modelo::COOKIE_DATA['path'],
                        'domain' => modelo::URL_CLEAN,
                        'secure' => modelo::COOKIE_DATA['secure'],
                        'httponly' => modelo::COOKIE_DATA['httponly'],
                        'samesite' => modelo::COOKIE_DATA['samesite']
                    ]
            );
        }

        return true;
    }
}
