<?php

class test extends panel implements controlador
{

    public function __construct($args)
    {
        parent::__construct($args);
    }

    public function run()
    {
        //al usarse como API de servicios, el run principal siempre redirigira a panel
        $loc = $this->applaga::URL . '/panel';
        header("Location: $loc");
    }

    public function api_integracion()
    {
        header('Content-Type: application/json');
        echo json_encode(['resultado' => 1, 'mensaje' =>
            'Hola Mundo desde la api para el curso de Integración de aplicaciones empresariales']);
        die();
    }
}
