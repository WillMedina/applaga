<?php

class utils
{

    static function crearhash(string $text)
    {
        $algoritmo = PASSWORD_ARGON2ID;
        $opciones = [
            'memory_cost' => PASSWORD_ARGON2_DEFAULT_MEMORY_COST,
            'time_cost' => 4,
            'threads' => 2
        ];

        return password_hash($text, $algoritmo, $opciones);
    }

    static function patron_UUID($str)
    {
        $patron = '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i';
        return preg_match($patron, $str) === 1;
    }

    static function verificarHash(string $password, string $hash)
    {
        return password_verify($password, $hash);
    }

    static function get_pseudotoken3()
    {
        $random_bytes = random_bytes(32); // genera 32 bytes aleatorios
        $token = bin2hex($random_bytes); // convierte los bytes en una cadena hexadecimal
        return $token;
    }

    static function get_pseudotoken2()
    {
        mt_srand(); // establece una semilla basada en el tiempo actual
        $token = bin2hex(openssl_random_pseudo_bytes(32)); // genera una cadena aleatoria de 32 bytes
        return $token;
    }

    static function get_pseudotoken()
    {
        $seguridad = true;
        try {
            //debe escribirse el codigo asi porque la funcion no acepta
            //escribirse con value por referencia
            $t1 = openssl_random_pseudo_bytes(32, $seguridad);
            $t2 = bin2hex($t1);
            return $t2;
        } catch (Throwable $e) {
            logger::log("Eror generando pseudotoken. {$e->getMessage()}", "helpers/utils:get_pseudotoken");
            return null;
        }
    }

    static function input_sanitize($string)
    {
        //funcion vieja que quitaba comillas...
        if (strlen($string > 0)) {
            $array_danger = array("'", '"', '\u2019', '\u2018', '%', '&#8217;', '&#8216;');
            $string = str_replace($array_danger, "", $string);
            $string = filter_var($string, FILTER_SANITIZE_STRING);
        }
        return $string;
    }

    static function sanitize_output($buffer)
    {
        //funcion que la salida la limpiaba de XSS
        $search = array(
            '/\>[^\S ]+/s', // strip whitespaces after tags, except space
            '/[^\S ]+\</s', // strip whitespaces before tags, except space
            '/(\s)+/s', // shorten multiple whitespace sequences
            '/<!--(.|\s)*?-->/' // Remove HTML comments
        );

        $replace = array(
            '>',
            '<',
            '\\1',
            ''
        );

        $buffer_output = preg_replace($search, $replace, $buffer);
        return $buffer_output;
    }

    static function time_UnixToMySQL($unixtime)
    {
        $mysql_time = date('Y-m-d H:i:s', $unixtime);
        return $mysql_time;
    }

    static function time_MySQLToUnix($mysqltime)
    {
        $timestamp = strtotime($mysqltime);
        return $timestamp;
    }

    static function formatTime($mysqltime, $format = "d-m-Y g:i A")
    {
        $time = strtotime($mysqltime);
        $myFormatForView = date($format, $time);
        return $myFormatForView;
    }

    static function v_dump($variable, $json = false)
    {
        $salida = null;
        ob_start();
        var_dump($variable);
        $result = ob_get_clean();

        if (!$json) {
            $salida = '<pre>' . $result . '</pre>';
        } else {
            $salida = str_replace('"', '\"', $result);
        }

        return $salida;
    }

    static function mes($numero)
    {
        $meses = array(
            1 => 'enero',
            2 => 'febrero',
            3 => 'marzo',
            4 => 'abril',
            5 => 'mayo',
            6 => 'junio',
            7 => 'julio',
            8 => 'agosto',
            9 => 'setiembre',
            10 => 'octubre',
            11 => 'noviembre',
            12 => 'diciembre'
        );

        return isset($meses[$numero]) ? $meses[$numero] : '';
    }

    static function es_android()
    {
        //cambiar si se necesita aumentar iOS
        $userAgent = $_SERVER['HTTP_USER_AGENT'];
        return stripos($userAgent, 'android') !== false;
    }

    static function es_movil_tablet()
    {
        $userAgent = $_SERVER['HTTP_USER_AGENT'];

        // Verifica si el User-Agent indica un dispositivo móvil o tablet
        return preg_match('/(android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini|mobile|tablet)/i', $userAgent);
    }

    static function obtener_browser_cliente()
    {
        $ip = "NO OBTENIDO - PROBABLE BOT OCULTANDO IP";
        $browser = "NO OBTENIDO - PROBABLE BOT";
        try {
            // Obtener la dirección IP del cliente
            if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
            }

            $browser = ((isset($_SERVER["HTTP_USER_AGENT"]) and strlen(trim($_SERVER["HTTP_USER_AGENT"])) != 0) ? $_SERVER['HTTP_USER_AGENT'] : 'BROWSER INDEFINIDO - POSIBLE BOT');
        } catch (THrowable $exc) {
            //echo $exc->getTraceAsString();
            $requested = $_SERVER['REQUEST_URI'];
            logger::log("Error tratando de obtener informacion de browser: " . $exc->getMessage() . " en: " . $requested, 'utils::obtener_browser_cliente', 'WARNING');
        }

        $request_uri = $_SERVER["REQUEST_URI"] ?? 'NO DEFINIDA';
        $referer = $_SERVER["HTTP_REFERER"] ?? 'NO DEFINIDA';
        $request_method = $_SERVER["REQUEST_METHOD"] ?? 'NO DEFINIDA';
        $query_string = $_SERVER["QUERY_STRING"] ?? 'NO DEFINIDA';
        $request_time_float = $_SERVER["REQUEST_TIME_FLOAT"] ?? 'NO DEFINIDA';

        return [
            'ip' => $ip,
            'browser' => $browser,
            'requested_uri' => $request_uri,
            'referer' => $referer,
            'request_method' => $request_method,
            'query_string' => $query_string,
            'request_time_float' => $request_time_float,
        ];
    }

    static function uuid5()
    {
        /*
          Namespace UUID para DNS (nombre de dominio): 6ba7b810-9dad-11d1-80b4-00c04fd430c8
          Namespace UUID para URL: 6ba7b811-9dad-11d1-80b4-00c04fd430c8
          Namespace UUID para OID (Identificador de Objeto): 6ba7b812-9dad-11d1-80b4-00c04fd430c8
          Namespace UUID para X.500 DN (Distinguished Name): 6ba7b814-9dad-11d1-80b4-00c04fd430c8
         */
        // Genera 16 bytes aleatorios
        $randomBytes = random_bytes(16);

        // Convierte los bytes en una cadena hexadecimal
        $hexData = bin2hex($randomBytes);

        // Define el namespace (puedes utilizar el namespace OID u otro)
        $namespace = '6ba7b812-9dad-11d1-80b4-00c04fd430c8'; // Namespace OID
        // Forma el nombre utilizando la cadena hexadecimal generada
        $name = $hexData;

        // Concatena el namespace y el nombre
        $combinedData = $namespace . $name;

        // Aplica un hash (SHA-1) para obtener la UUID de versión 5
        $uuid = sha1($combinedData);

        // Formatea la UUID en el formato canónico
        $formattedUuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split($uuid, 4));

        return $formattedUuid;
    }

    /**
     * Cadena que dado un string, si es vacia regresa un null
     * y si contiene algo lo devuelve tal cual
     */
    static function cadenavacia($str)
    {
        if (trim($str) === '') {
            return null;
        } else {
            return $str;
        }
    }

    static function redireccion($loc)
    {
        header("Location: $loc");
        die();
    }

    static function redireccion_y_log($loc, $mensaje_log, $loc_log)
    {
        logger::log($mensaje_log, $loc_log);
        header("Location: $loc");
        die();
    }

    static function api_error($mensaje_error, $donde)
    {
        logger::log($mensaje_error, $donde);
        header('Content-Type: application/json');
        echo json_encode(['resultado' => 0, 'mensaje' => $mensaje_error]);
        die();
    }

    static function api_error_exception($mensaje_error, $donde, $e)
    {
        try {
            //$e es siempre una excepcion
            logger::log($mensaje_error . ' - ' . $e->getMessage(), $donde);
            header('Content-Type: application/json');
            echo json_encode(['resultado' => 0, 'mensaje' => $mensaje_error, 'Excepcion' => $e]);
            die();
        } catch (Throwable $exc) {
            logger::log("Llamada a excepcion sin excepcion. - " . $exc->getMessage(), "helpers/utils:api_error_exception");
            die();
        }
    }
}
