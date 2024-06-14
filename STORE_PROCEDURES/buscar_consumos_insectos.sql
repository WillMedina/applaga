CREATE PROCEDURE `buscar_consumos_insectos`(
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
    
    IF (SELECT EXISTS(SELECT id FROM punto_historial_insectos 
		WHERE punto_id = p_punto_id and (fechahora >= fecha1 AND fechahora <= fecha2) and activo = 1)) THEN
		
        SELECT '1' as 'resultado', 'ok' as 'mensaje', 
			phi.id as 'PUNTOHISTORIAL_ID',
            phi.codigo_unico as 'PUNTOHISTORIAL_CODIGOUNICO',
            phi.punto_id as 'PUNTOCONTROL_ID',
            phi.lat as 'COORD_LAT',
            phi.`long` as 'COORD_LONG',
            fecha1 as 'INICIO_BUSQUEDA',
            fecha2 as 'FIN_BUSQUEDA',
            phi.fechahora as 'PUNTOHISTORIAL_FECHAHORA',
            MONTH(phi.fechahora) as 'PUNTOHISTORIAL_MONTH',
            phi.visita_id as 'VISITA_ID',
            phi.usuario_id as 'USUARIO_ID',
            IF((phi.lepidopteros + phi.microlepidopteros + 
            phi.hemipteros + phi.coleopteros +phi.moscas + 
            phi.mosquitos + phi.otros)>0,'SI','NO') AS 'PUNTOHISTORIAL_PRESENCIA',
            phi.deterioro as 'PUNTOHISTORIAL_DETERIORO',
            phi.recambio as 'PUNTOHISTORIAL_RECAMBIO',
            phi.lepidopteros as 'PUNTOHISTORIAL_LEPIDOPTEROS',
            phi.microlepidopteros as 'PUNTOHISTORIAL_MICROLEPIDOPTEROS',
            phi.hemipteros as 'PUNTOHISTORIAL_HEMIPTEROS',
            phi.coleopteros as 'PUNTOHISTORIAL_COLEOPTEROS',
            phi.moscas as 'PUNTOHISTORIAL_MOSCAS',
            phi.mosquitos as 'PUNTOHISTORIAL_MOSQUITOS',
            phi.otros as 'PUNTOHISTORIAL_OTROS',
            (phi.lepidopteros + phi.microlepidopteros + 
            phi.hemipteros + phi.coleopteros +phi.moscas + 
            phi.mosquitos + phi.otros) as 'PUNTOHISTORIAL_TOTALINSECTOS',
            phi.observaciones as 'PUNTOHISTORIAL_OBSERVACIONES'
        FROM punto_historial_insectos phi
        LEFT JOIN punto_insectos p ON (phi.punto_id = p.id)
        
        WHERE phi.punto_id = p_punto_id 
        -- and (ph.fechahora BETWEEN fecha1 and fecha2) 
        AND (phi.fechahora >= fecha1 AND phi.fechahora <= fecha2)
        and phi.activo = 1
        
        UNION
        
        SELECT '1' as 'resultado', 'ok' as 'mensaje', 
			'-' as 'PUNTOHISTORIAL_ID',
            '-' as 'PUNTOHISTORIAL_CODIGOUNICO',
            '-' as 'PUNTOCONTROL_ID',
            '-' as 'COORD_LAT',
            '-' as 'COORD_LONG',
            fecha1 as 'INICIO_BUSQUEDA',
            fecha2 as 'FIN_BUSQUEDA',
			'-' as 'PUNTOHISTORIAL_FECHAHORA',
            '-' as 'PUNTOHISTORIAL_MONTH',
            '-' as 'VISITA_ID',
            '-' as 'USUARIO_ID',
            '-' AS 'PUNTOHISTORIAL_PRESENCIA',
            '-' as 'PUNTOHISTORIAL_DETERIORO',
            '-' as 'PUNTOHISTORIAL_RECAMBIO',
            SUM(phi.lepidopteros) as 'PUNTOHISTORIAL_LEPIDOPTEROS',
            SUM(phi.microlepidopteros) as 'PUNTOHISTORIAL_MICROLEPIDOPTEROS',
            SUM(phi.hemipteros) as 'PUNTOHISTORIAL_HEMIPTEROS',
            SUM(phi.coleopteros) as 'PUNTOHISTORIAL_COLEOPTEROS',
            SUM(phi.moscas) as 'PUNTOHISTORIAL_MOSCAS',
            SUM(phi.mosquitos) as 'PUNTOHISTORIAL_MOSQUITOS',
            SUM(phi.otros) as 'PUNTOHISTORIAL_OTROS',
            SUM((phi.lepidopteros + phi.microlepidopteros + 
            phi.hemipteros + phi.coleopteros +phi.moscas + 
            phi.mosquitos + phi.otros)) as 'PUNTOHISTORIAL_TOTALINSECTOS',
            '-' as 'PUNTOHISTORIAL_OBSERVACIONES'
        FROM punto_historial_insectos phi
        LEFT JOIN punto_insectos p ON (phi.punto_id = p.id)
        
        WHERE phi.punto_id = p_punto_id 
        -- and (ph.fechahora BETWEEN fecha1 and fecha2) 
        AND (phi.fechahora >= fecha1 AND phi.fechahora <= fecha2)
        and phi.activo = 1;
        
    ELSE
		SELECT '0' AS 'resultado', 'NO SE DETECTARON CONSUMOS EN ESTE PUNTO DE CONTROL EN LAS FECHAS ESTABLECIDAS' as 'mensaje',
        p_punto_id as 'PUNTOCONTROL_ID', fecha1 as 'INICIO_BUSQUEDA', fecha2 as 'FIN_BUSQUEDA';
    END IF;
END