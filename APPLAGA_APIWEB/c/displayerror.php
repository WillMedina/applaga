<?php

class displayerror implements controlador
{

    private $parametros;

    public function __construct($args)
    {
        $this->parametros = $args;
    }

    public function run()
    {
        
    }

    public function error($codigo)
    {
        echo "Error " . $codigo;
    }

}
