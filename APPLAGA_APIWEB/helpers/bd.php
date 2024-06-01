<?php

class bd
{

    private static $instance = null;
    private $connection;
    private static $inifile = modelo::DB_INI;

    private function __construct()
    {
        try {
            $datafile = parse_ini_file(self::$inifile);
            $host = $datafile['host'];
            $db_name = $datafile['dbname'];
            $username = $datafile['username'];
            $password = $datafile['password'];

            $dsn = "mysql:host=$host;dbname=$db_name;charset=utf8mb4";

            $this->connection = new PDO($dsn, $username, $password);
        } catch (Throwable $exc) {
            $mensaje = "Error en la conexion a la BD. Error: " . $exc->getMessage();
            $donde = 'helpers/bd:__construct';
            logger::log($mensaje, $donde);
        }
    }

    public static function getINI()
    {
        return self::$inifile;
    }

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function store_procedure($sp_name, $params)
    {

        try {
            $query = "CALL $sp_name(" . rtrim(str_repeat('?,', count($params)), ',') . ")";
            $stmt = $this->connection->prepare($query);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $exc) {
            logger::log('Store procedure error: ' . $exc->getMessage(), 'bd:storeprocedure');
        }
    }

}
