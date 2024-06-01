<?php     

class visita implements modelo
{

    private $id;
    private $existe;
    private $datos;
    private $bd;

    public function __construct($id)
    {
        $this->id = $id;

        $this->bd = BD::getInstance();
        $sp = $this->bd->store_procedure('obtener_visita', [$this->id]);

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

    public function getOperarios()
    {
        if ($this->existe) {
            return $this->bd->store_procedure('obtener_visita_operarios', [$this->id]);
        } else {
            return null;
        }
    }

    public function getOperarios_tr()
    {
        if (is_null($this->getOperarios())) {
            return null;
        } else {
            $result = $this->getOperarios();
            $salida = '';
            if ($result[0]['resultado'] == 0) {
                $salida .= '<tr><td colspan="2" style="text-align:center"><i class="fas fa-exclamation-triangle"></i> ' . $result[0]['mensaje'] . '</td></tr>';
            } else {

                $conteo = count($result);
                for ($i = 0; $i < $conteo; $i++) {

                    $salida .= '<tr>';
                    $salida .= '<td style="text-align:center">(DNI: ' . $result[$i]['DNI'] . ') ' . $result[$i]['NOMBRES'] . ' ' . $result[$i]['APELLIDOS'] . '</td>';
                    $check = ( $result[$i]['SUPERVISOR'] == '1') ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
                    $salida .= "<td style=\"text-align:center\">$check</td>";
                    $salida .= '<tr>';

                    unset($check);
                }
            }

            return $salida;
        }
    }

    public function getServiciosRealizados()
    {
        if ($this->existe) {
            return $this->bd->store_procedure('obtener_visita_servicio', [$this->id]);
        } else {
            return null;
        }
    }

    public function getServiciosRealizados_tr()
    {
        if (is_null($this->getServiciosRealizados())) {
            return null;
        } else {
            $result = $this->getServiciosRealizados();

            $salida = '';
            if ($result[0]['resultado'] == 0) {
                $salida .= '<tr><td colspan="2" style="text-align:center"><i class="fas fa-exclamation-triangle"></i> ' . $result[0]['mensaje'] . '</td></tr>';
            } else {

                $conteo = count($result);
                for ($i = 0; $i < $conteo; $i++) {
                    $salida .= '<tr>';
                    $salida .= '<td style="text-align:center">' . $result[$i]['SERVICIO'] . '</td>';
                    $salida .= '<tr>';

                    unset($check);
                }
            }

            return $salida;
        }
    }

    public function getProductos()
    {
        if ($this->existe) {
            return $this->bd->store_procedure('obtener_visita_productos', [$this->id]);
        } else {
            return null;
        }
    }

    public function getProductos_tr()
    {
        if (is_null($this->getProductos())) {
            return null;
        } else {
            $result = $this->getProductos();

            $salida = '';
            if ($result[0]['resultado'] == 0) {
                $salida .= '<tr><td colspan="2" style="text-align:center"><i class="fas fa-exclamation-triangle"></i> ' . $result[0]['mensaje'] . '</td></tr>';
            } else {

                $conteo = count($result);

                for ($i = 0; $i < $conteo; $i++) {
                    $nombre = $result[$i]['NOMBRE'];
                    $nombrecomercial = (strlen($result[$i]['NOMBRECOMERCIAL']) === 0 ? '' : ' (' . $result[$i]['NOMBRECOMERCIAL'] . ')');
                    $ingredienteactivo = (strlen($result[$i]['INGREDIENTEACTIVO']) === 0 ? '' : ' [' . $result[$i]['INGREDIENTEACTIVO'] . ']');

                    $salida .= '<tr>';
                    $salida .= '<td style="text-align:center">' . $nombre . $nombrecomercial . $ingredienteactivo . '</td>';
                    $salida .= '<tr>';

                    unset($check);
                }
            }

            return $salida;
        }
    }

    public function getEquipos()
    {
        if ($this->existe) {
            return $this->bd->store_procedure('obtener_visita_equipos', [$this->id]);
        } else {
            return null;
        }
    }

    public function getEquipos_tr()
    {
        if (is_null($this->getEquipos())) {
            return null;
        } else {
            $result = $this->getEquipos();

            $salida = '';
            if ($result[0]['resultado'] == 0) {
                $salida .= '<tr><td colspan="2" style="text-align:center"><i class="fas fa-exclamation-triangle"></i> ' . $result[0]['mensaje'] . '</td></tr>';
            } else {

                $conteo = count($result);

                for ($i = 0; $i < $conteo; $i++) {
                    $nombre = $result[$i]['NOMBRE'];

                    $salida .= '<tr>';
                    $salida .= '<td style="text-align:center">' . $nombre . '</td>';
                    $salida .= '<tr>';

                    unset($check);
                }
            }

            return $salida;
        }
    }

    public function getDocumentos()
    {
        
    }

    public function existe()
    {
        return $this->existe;
    }

    public function acceso($usuario)
    {
        $result = $this->bd->store_procedure('accesocliente_visita', [$usuario, $this->datos->VISITA_ID]);
        logger::log('Solicitud de analisis de acceso de cliente a visita (c:' . $usuario . ',v:' . $this->datos->VISITA_ID . '),' .
                ' resultado: [acceso=' . $result[0]['ACCESO'] . ', mensaje=' . $result[0]['mensaje'] . ']', 'm/visita', 'WARNING');
        return $result[0]['ACCESO'] == '1' ? true : false;
    }

    public function getActivo()
    {
        if ($this->existe) {
            return $this->datos->ACTIVO;
        } else {
            return 0;
        }
    }

    public function servicio_html()
    {
        if ($this->existe) {

            $cambios = [];
            $cambios["{VISITA_ID}"] = $this->datos->VISITA_ID;
            $cambios["{TITULO}"] = 'VER SERVICIO ' . $this->datos->VISITA_ID . ' (' . $this->datos->CODIGO_UNICO . ')';
            $cambios["{CODIGO_UNICO}"] = $this->datos->CODIGO_UNICO;
            $cambios["{INICIO}"] = utils::formatTime($this->datos->INICIO);
            $cambios["{FIN}"] = utils::formatTime($this->datos->FIN);
            $cambios["{CLIENTE}"] = $this->datos->CLIENTE_NOMBRECLAVE;
            $cambios["{RAZONSOCIAL}"] = $this->datos->CLIENTE_RAZONSOCIAL;
            $cambios["{DIRECCION}"] = $this->datos->DIRECCION;
            $cambios["{RESPONSABLE}"] = $this->datos->RESPONSABLE_EN_VISITA;
            $cambios["{CARGO_RESPONSABLE}"] = $this->datos->CARGO_DE_RESPONSABLE_EN_VISITA;
            $cambios["{OBS_CLI}"] = $this->datos->OBSERVACIONES_CLIENTE;
            $cambios["{OBS_REC}"] = $this->datos->OBSERVACIONES_Y_RECOMENDACIONES;
            $cambios["{N_CONSTANCIA}"] = $this->datos->NUMERO_CONSTANCIA;
            $cambios["{N_CERTIFICADO}"] = $this->datos->NUMERO_CERTIFICADO;
            $cambios["{VENCIMIENTO_CERTIFICADO}"] = $this->datos->VENCIMIENTO_CERTIFICADO;
            $cambios["{COND_INT}"] = $this->datos->CONDICIONES_INTERNAS;
            $cambios["{COND_EXT}"] = $this->datos->CONDICIONES_EXTERNAS;
            $cambios["{ULTIMA_MODIFICACION}"] = utils::formatTime($this->datos->ULTIMAMODIFICACION);
            $cambios["{VISTO_BUENO}"] = ($this->datos->VISTOBUENO_CLIENTE == "1" ) ? "SI" : "NO";

            $cambios["{LISTA_OPERARIOS_TR}"] = $this->getOperarios_tr();
            $cambios["{LISTA_SERVICIOS_REALIZADOS_TR}"] = $this->getServiciosRealizados_tr();
            $cambios["{LISTA_PRODUCTOS_TR}"] = $this->getProductos_tr();
            $cambios["{LISTA_EQUIPOS_TR}"] = $this->getEquipos_tr();

            $plantilla_ver = self::FOLDER . '/v/' . self::DEFULT_THEME . '/html/panel_servicios_ver.html';
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

    public function cliente_servicio_html()
    {
        if ($this->existe) {

            $cambios = [];
            $cambios["{VISITA_ID}"] = $this->datos->VISITA_ID;
            $cambios["{TITULO}"] = 'VER SERVICIO ' . $this->datos->VISITA_ID . ' (' . $this->datos->CODIGO_UNICO . ')';
            $cambios["{CODIGO_UNICO}"] = $this->datos->CODIGO_UNICO;
            $cambios["{INICIO}"] = utils::formatTime($this->datos->INICIO);
            $cambios["{FIN}"] = utils::formatTime($this->datos->FIN);
            $cambios["{CLIENTE}"] = $this->datos->CLIENTE_NOMBRECLAVE;
            $cambios["{RAZONSOCIAL}"] = $this->datos->CLIENTE_RAZONSOCIAL;
            $cambios["{DIRECCION}"] = $this->datos->DIRECCION;
            $cambios["{RESPONSABLE}"] = $this->datos->RESPONSABLE_EN_VISITA;
            $cambios["{CARGO_RESPONSABLE}"] = $this->datos->CARGO_DE_RESPONSABLE_EN_VISITA;
            $cambios["{OBS_CLI}"] = $this->datos->OBSERVACIONES_CLIENTE;
            $cambios["{OBS_REC}"] = $this->datos->OBSERVACIONES_Y_RECOMENDACIONES;
            $cambios["{N_CONSTANCIA}"] = $this->datos->NUMERO_CONSTANCIA;
            $cambios["{N_CERTIFICADO}"] = $this->datos->NUMERO_CERTIFICADO;
            $cambios["{VENCIMIENTO_CERTIFICADO}"] = $this->datos->VENCIMIENTO_CERTIFICADO;
            $cambios["{COND_INT}"] = $this->datos->CONDICIONES_INTERNAS;
            $cambios["{COND_EXT}"] = $this->datos->CONDICIONES_EXTERNAS;
            $cambios["{VISTO_BUENO}"] = ($this->datos->VISTOBUENO_CLIENTE == "1" ) ? "SI" : "NO";
            $cambios["{ULTIMA_MODIFICACION}"] = utils::formatTime($this->datos->ULTIMAMODIFICACION);
            
            $cambios["{LISTA_OPERARIOS_TR}"] = $this->getOperarios_tr();
            $cambios["{LISTA_SERVICIOS_REALIZADOS_TR}"] = $this->getServiciosRealizados_tr();
            $cambios["{LISTA_PRODUCTOS_TR}"] = $this->getProductos_tr();
            $cambios["{LISTA_EQUIPOS_TR}"] = $this->getEquipos_tr();

            $plantilla_ver = self::FOLDER . '/v/' . self::DEFULT_THEME . '/html/cliente_servicios_ver.html';
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
}
