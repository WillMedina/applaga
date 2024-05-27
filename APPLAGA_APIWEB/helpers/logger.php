<?php

class logger
{

    private static $folder = modelo::FOLDER_LOG;

    static function log($mensaje, $donde, $tipo = "ERROR")
    {
        try {
            $fecha = date("Y-m-d H:i:s");
            $nombre_archivo = date("Ymd") . '.txt';
            $request_uri = $_SERVER["REQUEST_URI"] ?? 'HIDDEN_REQUEST';
            $linea = "[$fecha][$tipo][$donde][$request_uri] > $mensaje" . PHP_EOL;

            $file = self::$folder . '/' . $nombre_archivo;

            $handle = fopen($file, 'a+');
            fwrite($handle, $linea);
            fclose($handle);
        } catch (Throwable $exc) {
            
        }
    }
}
