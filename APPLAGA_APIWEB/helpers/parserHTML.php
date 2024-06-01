<?php

class parserHTML
{

    private $stream;
    // Esto resuelve el problema del OPENSSL
    // https://jorgearce.es/index.php/post/2017/08/07/file_get_contents%28%29%3A-Failed-to-enable-crypto
    // https://stackoverflow.com/questions/26148701/file-get-contents-ssl-operation-failed-with-code-1-and-more
    static $arrContextOptions = array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false,
        ),
    );
    private $cambios = array();

    public function __construct($nombre_archivo)
    {
        try {
            if (file_exists($nombre_archivo)) {
                $this->stream = file_get_contents($nombre_archivo, false, stream_context_create(self::$arrContextOptions));
            } else {
                $this->stream = null;
            }
        } catch (Throwable $e) {
            logger::log("Error al abrir un stream de archivo. {$e->getMessage()}", "helpers/parserHTML:__construct");
            $this->stream = null;
        }
    }

    public function cambiar($etiqueta, $valor)
    {
        $this->cambios[$etiqueta] = $valor;
    }

    public function cambioplano($texto, $cambios)
    {
        foreach ($cambios as $key => $value) {
            $texto = str_replace($key, $value, $texto);
        }

        return $texto;
    }

    public function print($en_variable = false)
    {
        foreach ($this->cambios as $key => $value) {
            $this->stream = str_replace($key, $value, $this->stream);
        }

        if ($en_variable) {
            return $this->stream;
        } else {
            $sv = 'prod';
            if (modelo::COMPRESION_HTML) {
                ob_start('utils::sanitize_output');
            }

            if (!modelo::STATICVERSIONS) {
                $sv = date('Ymdhis');
            }
            
            $this->stream = str_replace('{STATICVERSION}', $sv, $this->stream);
            echo $this->stream;
        }
    }
}
