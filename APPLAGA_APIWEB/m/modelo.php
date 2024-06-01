<?php

interface modelo
{

    const DEFULT_THEME = 'default_theme';
    const URL = 'https://applaga.net';
    const URL_CLEAN = 'applaga.net';
    const FOLDER = '/home/bunkernorte/web/applaga.net';
    const COMPRESION_HTML = TRUE;
    const STATICVERSIONS = FALSE;
    const FOLDER_DOCS = '/home/bunkernorte/web/applaga.net/static';
    const FOLDER_LOG = '/home/bunkernorte/web/applaga.net/log';
    const FOLDER_ACCESS = '/home/bunkernorte/web/applaga.net/acceso';
    const DB_INI = '/home/bunkernorte/web/applaga.net/config_db.ini';
    const COOKIE_DATA = [
        'name' => 'hash_sesion',
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ];

    function __construct($id);
}
