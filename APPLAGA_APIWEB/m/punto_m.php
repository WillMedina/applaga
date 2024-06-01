<?php

class punto_m implements modelo
{

    private $id;
    private $existe;
    private $datos;
    private $bd;

    public function __construct($id)
    {
        $this->id = $id;

        $this->bd = BD::getInstance();
        $sp = $this->bd->store_procedure('obtener_punto', [$this->id]);

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

    public function punto_html()
    {
        if ($this->existe) {
            $cambios = [
                '{PUNTOCONTROL_ID}' => $this->datos->PUNTOCONTROL_ID,
                '{CODIGO_UNICO}' => $this->datos->CODIGO_UNICO,
                '{PUNTOCONTROL_NOMBRE}' => trim($this->datos->PUNTOCONTROL_NOMBRE),
                '{PUNTOCONTROL_UBICACION_LOCAL}' => trim($this->datos->PUNTOCONTROL_UBICACION_LOCAL),
                '{CLIENTE_NOMBRECLAVE}' => trim($this->datos->CLIENTE_NOMBRECLAVE),
                '{CLIENTE_RAZONSOCIAL}' => trim($this->datos->CLIENTE_RAZONSOCIAL),
                '{CLIENTELOCAL_DIRECCION}' => trim($this->datos->CLIENTELOCAL_DIRECCION),
                '{PUNTOCONTROL_NUMERO}' => trim($this->datos->PUNTOCONTROL_NUMERO),
                '{UNIDADMEDIDA}' => $this->datos->UNIDADMEDIDA_NOMBRE,
                '{PUNTOCONTROL_GEOLOCALIZACION}' => $this->datos->PUNTOCONTROL_GEOLOCALIZACION
            ];
            $plantilla_ver = self::FOLDER . '/v/' . self::DEFULT_THEME . '/html/panel_puntos_consumos.html';
            $parser = new parserHTML($plantilla_ver);

            foreach ($cambios as $key => $value) {
                $parser->cambiar($key, $value);
            }

            $contenido = $parser->print(true);
            return $contenido;
        } else {
            return null;
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
