<?php
session_start();
include 'm/dependencias.php';

filtrospam::acceso_plano2();

$url = isset($_GET['url']) ? htmlentities($_GET['url']) : '';
$dominio = (isset($_SERVER['HTTPS']) ? "https://" : "http://") . $_SERVER['HTTP_HOST'];
// Separar los parámetros utilizando la barra como delimitador
$parametros = explode('/', $url);
$conteo_parametros = count($parametros);

if (strlen($parametros[0]) == 0 or is_null($parametros[0])) {
    //$parametros[0] = 'index';
    header("Location: $dominio/panel");
    die();
}

if (class_exists($parametros[0])) {
    //si la clase existe es que hay controlador
    $clase = new $parametros[0]($parametros);
    if ($conteo_parametros >= 2) {
        //si hay mas de 1 parametro es que se ha llamado a un metodo
        if (method_exists($clase, $parametros[1])) {
            //si un metodo existe, se ejecuta
            $metodo = $parametros[1];
            $clase->$metodo();
        } else {
            //si no existe se redirecciona a la clase solamente
            $location = "$dominio/{$parametros[0]}";
            header("Location: $location");
            die();
        }
    } else {
        $clase->run();
    }
} else {
    //cualquier otro caso simplemente redirigir a panel
    header("Location: $dominio/panel");
    die();
}