<?php

date_default_timezone_set('America/Lima');

include 'helpers/utils.php';
include 'helpers/bd.php';
include 'helpers/logger.php';
include 'helpers/parserHTML.php';
include 'helpers/sesion.php';
include 'helpers/rutas.php';
include 'helpers/filtrospam.php';
include 'helpers/uploader.php';

include 'm/modelo.php';
include 'm/applaga.php';
include 'm/visita.php';
include 'm/documento_m.php';
include 'm/punto_m.php';
include 'm/insectos_m.php';

include 'c/controlador.php';
include 'c/panel.php';
include 'c/login.php';
include 'c/displayerror.php';
include 'c/servicio.php';
include 'c/documento.php';
include 'c/cliente.php';
include 'c/qr.php';
include 'c/test.php';
