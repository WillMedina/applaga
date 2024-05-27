<?php

class rutas
{

    static function usuario()
    {
        return [
            'SERVICIOS' => 'panel/servicio',
            /*'DOCUMENTACI&Oacute;N' => 'panel/documento',*/
            'PUNTOS CONTROL' => 'panel/menu_puntos',
            'BIBL. DE DATOS' => 'panel/datos'
            /*'CONFIG USUARIO' => 'panel/usuario'*/
        ];
    }

    static function cliente()
    {
        return [
            'MIS SERVICIOS' => 'panel/mis_servicios',
            'MIS DOCUMENTOS' => 'panel/mis_documentos',
            'SOPORTE' => 'panel/soporte',
            'CONFIG USUARIO' => 'panel/usuario'
        ];
    }

}
