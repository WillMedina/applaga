<?php

interface modelo
{

    const DEFULT_THEME = 'default_theme';
    const URL = 'https://beta.applaga.net';
    const URL_CLEAN = 'beta.applaga.net';
    const FOLDER = '/home/bunkernorte/web/beta.applaga.net';
    const COMPRESION_HTML = TRUE;
    const STATICVERSIONS = FALSE;
    const FOLDER_DOCS = '/home/bunkernorte/web/beta.applaga.net/static';
    const FOLDER_LOG = '/home/bunkernorte/web/beta.applaga.net/log';
    const FOLDER_ACCESS = '/home/bunkernorte/web/beta.applaga.net/acceso';
    const DB_INI = '/home/bunkernorte/web/beta.applaga.net/config_db.ini';
    const COOKIE_DATA = [
        'name' => 'hash_sesion',
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ];

    function __construct($id);
}
