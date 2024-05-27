<?php

class filtrospam
{

    // Esto resuelve el problema del OPENSSL
    // https://jorgearce.es/index.php/post/2017/08/07/file_get_contents%28%29%3A-Failed-to-enable-crypto
    // https://stackoverflow.com/questions/26148701/file-get-contents-ssl-operation-failed-with-code-1-and-more
    static $arrContextOptions = array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false,
        ),
    );
    static private $token_ipinfo = '8b53b6ae6f8e5e';
    static private $rickroll = 'https://www.youtube.com/watch?v=tgTUtfb0Ok8';

    // curl ipinfo.io/181.64.105.158/country?token=8b53b6ae6f8e5e

    static function verificarPais($ip)
    {
        if (self::verificar_spam($ip)) {
            header("Location: " . self::$rickroll);
            die();
        } else if (self::verificar_nospam($ip)) {
            //no hacer nada porque paso verificacion previa
        } else {
            //no ha sido registrado
            $url = 'https://ipinfo.io/' . $ip . '/country?token=' . self::$token_ipinfo;
            try {
                $flag = file_get_contents($url, false, stream_context_create(self::$arrContextOptions));

                if (trim($flag) !== 'PE') {
                    $requested = $_SERVER['REQUEST_URI'];
                    self::registrar_spam($ip, json_encode(utils::obtener_browser_cliente(), true), $requested);
                    header("Location: " . self::$rickroll);
                    die();
                } else {
                    $requested = $_SERVER['REQUEST_URI'];
                    self::registrar_nospam($ip, json_encode(utils::obtener_browser_cliente(), true), $requested);
                }
            } catch (Throwable $exc) {
                logger::log('Error obteniendo informacion de ubicacion ' . $exc->getMessage(), 'helpers/filtrospam:verificarPais');
                return false;
            }
        }
    }

    static function registrar_nospam($ip, $databrowser, $requested)
    {
        try {
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_nospam', [$ip, $databrowser, $requested]);
            return true;
        } catch (Throwable $exc) {
            logger::log('Error registrando spam: ' . $exc->getMessage(), 'helpers/filtrospam:verificar_spam');
            return false;
        }
    }

    static function registrar_spam($ip, $databrowser, $requested)
    {
        try {
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_spam', [$ip, $databrowser, $requested]);
            return true;
        } catch (Throwable $exc) {
            logger::log('Error registrando spam: ' . $exc->getMessage(), 'helpers/filtrospam:verificar_spam');
            return false;
        }
    }

    static function verificar_nospam($ip)
    {
        try {
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_spam', [$ip]);

            if ($sp[0]['resultado'] == "1" and $sp[0]['ACCESS'] == 'ACCESS') {
                return true;
            } else {
                return false;
            }
        } catch (Throwable $exc) {
            logger::log('Error verificando no spam: ' . $exc->getMessage(), 'helpers/filtrospam:verificar_nospam');
            return false;
        }
    }

    static function verificar_spam($ip)
    {
        try {
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('buscar_spam', [$ip]);

            if ($sp[0]['resultado'] == "1" and $sp[0]['ACCESS'] == 'FORBID') {
                return true;
            } else {
                return false;
            }
        } catch (Throwable $exc) {
            logger::log('Error verificando spam: ' . $exc->getMessage(), 'helpers/filtrospam:verificar_spam');
            return false;
        }
    }

    static function acceso_plano($objUs)
    {
        try {
            $fecha = date("Y-m-d H:i:s");
            $nombre_archivo = date("Ymd") . '.txt';

            $cadena_full = json_encode($objUs, true);
            $linea = "[$fecha] > $cadena_full" . PHP_EOL;
            $folder = modelo::FOLDER_ACCESS;
            $file = $folder . '/' . $nombre_archivo;

            $handle = fopen($file, 'a+');
            fwrite($handle, $linea);
            fclose($handle);
        } catch (Exception $exc) {
            logger::log('Error registrando acceso: ' . $exc->getMessage(), 'helpers/filtrospam:acceso_plano');
            return false;
        }
    }

    static function acceso_plano2()
    {
        try {
            $bd = bd::getInstance();

            $ip = (($_SERVER["REMOTE_ADDR"] ?? $_SERVER["HTTP_CF_CONNECTING_IP"]) ?? $_SERVER["HTTP_X_FORWARDED_FOR"]);
            $sp = $bd->store_procedure('buscar_acceso', [$ip]);

            if ($sp[0]['resultado'] == '1' && $sp[0]['DENEGADO'] == '1') {
                $sp_update = $bd->store_procedure('actualizar_acceso', [$ip]);
                header("Location: " . self::$rickroll);
                die();
            }
            
            if($sp[0]['resultado'] == '1' && $sp[0]['DENEGADO'] == '0'){
                $sp_update = $bd->store_procedure('actualizar_acceso', [$ip]);
                return true;
            }
            
            $params = [
                $ip,
                json_encode($_SERVER, true)
            ];
            
            $sp_create = $bd->store_procedure('registrar_acceso', $params);
            return true;
        } catch (Exception $exc) {
            logger::log('Error registrando acceso: ' . $exc->getMessage(), 'helpers/filtrospam:acceso_plano2');
            return false;
        }
    }
}
