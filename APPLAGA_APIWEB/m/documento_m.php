<?php

class documento_m implements modelo
{

    private $id;
    private $existe;
    private $datos;
    private $bd;

    public function __construct($id)
    {
        $this->id = $id;

        $this->bd = BD::getInstance();
        $sp = $this->bd->store_procedure('obtener_documento', [$this->id]);

        if ($sp[0]['resultado'] == "0") {
            $this->existe = false;
            $this->datos = new stdClass();
        } else {
            // al ser una consulta por ID, en teoria deberia ser uno nada mas
            $this->existe = true;
            //$this->datos = $sp[0];
            $this->datos = json_decode(json_encode($sp[0]));
        }
    }

    public function getData()
    {
        return $this->datos;
    }

    public function existe()
    {
        return $this->existe;
    }

}
