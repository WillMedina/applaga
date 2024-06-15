CREATE PROCEDURE `buscar_consumos`(
	IN p_punto_id INT,
    IN fecha1 DATE,
    IN fecha2 DATE
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		-- SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
        SELECT '0' as 'resultado', CONCAT(@sqlstate,' ', @text, ' - ', @errno) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    IF (SELECT EXISTS(SELECT id FROM punto_historial WHERE punto_id = p_punto_id and (fechahora BETWEEN fecha1 and fecha2) and activo = 1)) THEN
		SELECT '1' as 'resultado', 'ok' as 'mensaje', 
			ph.id as 'PUNTOHISTORIAL_ID',
            ph.punto_id as 'PUNTOCONTROL_ID',
            ph.lat as 'COORD_LAT',
            ph.long as 'COORD_LONG',
            ph.hubo_consumo as 'PUNTOHISTORIAL_HUBOCONSUMO',
            ph.medida_inicial as 'PUNTOHISTORIAL_MEDIDAINICIAL',
            ph.medida as 'PUNTOHISTORIAL_MEDIDA',
            um.nombre as 'UNIDADMEDIDA_NOMBRE',
            um.simbolo as 'UNIDADMEDIDA_SIMBOLO',
            fecha1 as 'INICIO_BUSQUEDA',
            fecha2 as 'FIN_BUSQUEDA',
            ph.fechahora as 'PUNTOHISTORIAL_FECHAHORA',
            ph.visita_id as 'VISITA_ID',
            ph.usuario_id as 'USUARIO_ID',
            ph.recambio as 'PUNTOHISTORIAL_RECAMBIO',
            ROUND((ph.medida - ph.medida_inicial),3) as 'PUNTOHISTORIAL_CONSUMO',
            ph.observaciones as 'PUNTOHISTORIAL_OBSERVACIONES'
        FROM punto_historial ph
        LEFT JOIN punto p ON (ph.punto_id = p.id)
        LEFT JOIN unidadmedida um ON (p.unidadmedida_id = um.id)
        WHERE ph.punto_id = p_punto_id 
        -- and (ph.fechahora BETWEEN fecha1 and fecha2) 
        AND (ph.fechahora >= fecha1 AND ph.fechahora <= fecha2)
        and ph.activo = 1
        ORDER BY ph.fechahora ASC;
    ELSE
		SELECT '0' AS 'resultado', 'NO SE DETECTARON CONSUMOS EN ESTE PUNTO DE CONTROL EN LAS FECHAS ESTABLECIDAS' as 'mensaje',
        p_punto_id as 'PUNTOCONTROL_ID', fecha1 as 'INICIO_BUSQUEDA', fecha2 as 'FIN_BUSQUEDA';
    END IF;
    
END