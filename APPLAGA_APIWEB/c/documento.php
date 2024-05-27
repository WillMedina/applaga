<?php

class documento extends panel implements controlador
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

    public function api_listardocumentos()
    {
        $this->security(1);
        $datos = json_decode(file_get_contents('php://input'), true);

        $n_constancia = htmlentities($datos["n_constancia"]);
        $codigo_unico = htmlentities($datos["codigo_unico"]);

        $bd = bd::getInstance();
        $sp = $bd->store_procedure('buscar_documento', [$n_constancia, $codigo_unico]);
        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_listardocumentos_visita()
    {
        $this->security(1);
        $datos = json_decode(file_get_contents('php://input'), true);

        $visita_id = htmlentities($datos["visita_id"]);

        $bd = bd::getInstance();
        $sp = $bd->store_procedure('obtener_visita_documento', [$visita_id]);
        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }
    
    public function api_listarfotos_visita()
    {
        $this->security(1);
        $datos = json_decode(file_get_contents('php://input'), true);

        $visita_id = htmlentities($datos["visita_id"]);

        $bd = bd::getInstance();
        $sp = $bd->store_procedure('obtener_visita_fotos', [$visita_id]);
        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    public function api_datosdocumento()
    {
        //hay dos formas de hacerlo, a traves del model o a tre ves del SP directo
        $this->security(1);
        //sp: obtener_documento
        $datos = json_decode(file_get_contents('php://input'), true);

        $visita_documento_id = htmlentities($datos["vdi"]);
        $bd = bd::getInstance();
        $sp = $bd->store_procedure('obtener_documento', [$visita_documento_id]);
        header('Content-Type: application/json');
        echo json_encode(["resultado" => 1, 'mensaje' => 'ok', 'datos' => $sp]);
        die();
    }

    /*
     * Recibe un formdata (en el post y files), distinto a los php://input hasta
     * ahora
     * en el form data recibe un nombre, un codigo unico de servicio y el archivo
     */

    public function api_recibirArchivo()
    {
        $this->security_api(1);
        try {
            $existe_archivo = $_FILES ?? null;

            if (is_null($existe_archivo)) {
                utils::api_error("No se ha enviado ningun archivo", "c/servicio.php:api_recibirArchivo");
            }

            if ($_FILES["archivo"]["error"] != 0) {
                $mensaje_error = upload_errormsg($_FILES["archivo"]["error"]);
                utils::api_error("No se pudo subir el archivo porque", "c/servicio.php:api_recibirArchivo");
            }

            $respuesta = uploader::subir_archivo('archivo');

            $visita_id = $this->obtener_visita_cu($_POST["cu_visita"]);
            $reemplaza_a = ($_POST["reemplazar"] == '0' ? null : $this->obtener_id_cu($_POST["reemplazar"]));

            if (!is_numeric($visita_id) or $visita_id == '0') {
                utils::api_error("No se encontro ID de visita al querer subir un archivo", "c/servicio.php:api_recibirArchivo");
            }

            $peso_bytes = $_FILES["archivo"]["size"]; //peso en bytes;

            $extension = pathinfo($_FILES["archivo"]["name"], PATHINFO_EXTENSION);

            $esfoto = 0;
            $imagenes_mime = ['jpg', 'jpeg', 'png'];
            if (in_array($extension, $imagenes_mime)) {
                $esfoto = 1;
                $peso_bytes = $respuesta["size"];
            }

            $mime = $_FILES["archivo"]["type"];
            $nombre = $_POST["nombre"];
            $nombreoriginal = $_FILES["archivo"]["name"];

            $sesion = sesion::info_sesion();
            $autor = $sesion["info_usuario"]["USUARIO_ID"];
            $descripcion = $_POST["descripcion"];
            $publicado = 0;
            $ruta = $respuesta["nombre"];

            $param = [
                $visita_id, $reemplaza_a,
                $extension, $mime,
                $nombre, $nombreoriginal,
                $autor, $descripcion,
                $publicado, $ruta,
                $peso_bytes, $esfoto
            ];

            $bd = bd::getInstance();
            $sp = $bd->store_procedure('registrar_visita_documento', $param);

            header('Content-Type: application/json');
            echo json_encode(['resultado' => 1, 'mensaje' => 'ok']);
            die();
        } catch (Throwable $exc) {
            utils::api_error_exception("Error recibiendo un archivo",
                    "c/servicio.php:api_recibirArchivo",
                    $exc);
        }
    }

    private function obtener_visita_cu($codigo_unico)
    {
        try {
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_visita_codigounico', [$codigo_unico]);
            $salida = '0';
            if ($sp[0]['resultado'] != '0') {
                $salida = $sp[0]['VISITA_ID'];
            }

            return $salida;
        } catch (Throwable $exc) {
            return '0';
        }
    }

    private function obtener_id_cu($codigo_unico)
    {
        try {
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_documento_cu', [$codigo_unico]);
            $salida = null;
            if ($sp[0]['resultado'] != '0') {
                $salida = $sp[0]['DOCUMENTO_ID'];
            }

            return $salida;
        } catch (Throwable $exc) {
            return null;
        }
    }

    public function api_descargarDocumento()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $codigo_unico = htmlentities($datos["codigo_unico"]);
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_documento_cu', [$codigo_unico]);

            if ($sp[0]['resultado'] == "1") {
                // Aquí deberías tener tu lógica para buscar el archivo en la base de datos
                // y obtener la ruta del archivo basado en el código único
                $nombre_archivo = $sp[0]['RUTA_DOCUMENTO'];

                // Ruta completa del archivo
                $ruta_completa = modelo::FOLDER_DOCS . '/' . $nombre_archivo;

                // Envía el archivo para descargar
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . $nombre_archivo . '"');
                readfile($ruta_completa);
                die();
            } else {
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 0, 'mensaje' => 'Archivo no encontrado', 'codigo_unico' => $codigo_unico, 'sp' => $sp]);
                die();
            }
        } catch (Throwable $exc) {
            utils::api_error_exception("Error en la descarga de un archivo",
                    "c/servicio.php:api_recibirArchivo",
                    $exc);
        }
    }

    public function api_borrarDocumento()
    {
        $this->security_api(1);
        try {
            $datos = json_decode(file_get_contents('php://input'), true);
            $codigo_unico = htmlentities($datos["codigo_unico"]);
            $bd = bd::getInstance();
            $sp = $bd->store_procedure('obtener_documento_cu', [$codigo_unico]);

            if ($sp[0]['resultado'] == "1") {
                $visita_documento_id = $sp[0]['DOCUMENTO_ID'];

                $sp2 = $bd->store_procedure('desactivar_visita_documento', [$visita_documento_id]);
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 1, 'mensaje' => 'ok', 'datos' => $sp2]);
                die();
            } else {
                header('Content-Type: application/json');
                echo json_encode(['resultado' => 0, 'mensaje' => 'Archivo no encontrado', 'codigo_unico' => $codigo_unico, 'sp' => $sp]);
                die();
            }
        } catch (Throwable $exc) {
            utils::api_error_exception("Error en la descarga de un archivo",
                    "c/servicio.php:api_recibirArchivo",
                    $exc);
        }
    }

    public function api_publicarDocumento()
    {
        
    }
}
