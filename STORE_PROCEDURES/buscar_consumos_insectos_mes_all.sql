CREATE PROCEDURE `buscar_consumos_insectos_mes_all`(
	IN p_local_id INT,
    IN p_month INT,
    IN p_year INT
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
    
    IF (SELECT EXISTS(
		SELECT phi.id 
		FROM punto_historial_insectos phi 
        LEFT JOIN punto_insectos p ON (phi.punto_id = p.id)
        WHERE p.local_id = p_local_id AND MONTH(phi.fechahora) = p_month
        AND YEAR(phi.fechahora) = p_year
	)) THEN
		-- si hay existencias las formatea
		SELECT 
			'1' as 'resultado',
            'ok' as 'mensaje',
			phi.punto_id as 'PUNTO_ID',
			p_month as 'MES',
			p_year as 'YEAR',
			p.nombre_punto as 'PUNTO_NOMBRE',
            p.numero as 'PUNTOCONTROL_NUMERO',
			p.ubicacion_local as 'PUNTOCONTROL_UBICACION',
            p.geoloc as 'PUNTOCONTROL_GEOLOCALIZACION',
            pit.nombre as 'PUNTOCONTROL_TIPO',
            pit.nombre_corto as 'PUNTOCONTROL_TIPO_NC',
            
            SUM(phi.lepidopteros) as 'PUNTOHISTORIAL_LEPIDOPTEROS',
            SUM(phi.microlepidopteros) as 'PUNTOHISTORIAL_MICROLEPIDOPTEROS',
            SUM(phi.hemipteros) as 'PUNTOHISTORIAL_HEMIPTEROS',
            SUM(phi.coleopteros) as 'PUNTOHISTORIAL_COLEOPTEROS',
            SUM(phi.moscas) as 'PUNTOHISTORIAL_MOSCAS',
            SUM(phi.mosquitos) as 'PUNTOHISTORIAL_MOSQUITOS',
            SUM(phi.otros) as 'PUNTOHISTORIAL_OTROS',
            
            SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros) as 'PUNTOHISTORIAL_TOTAL',
            
            (SUM(phi.lepidopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_LE',
			
            (SUM(phi.microlepidopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_MLE',
            
            (SUM(phi.hemipteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_HE',
            
            (SUM(phi.coleopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_CO',
            
            (SUM(phi.moscas)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_M',
            
            (SUM(phi.mosquitos)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_MO',
            
            (SUM(phi.otros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_O'
		FROM punto_insectos p
		LEFT JOIN punto_historial_insectos phi ON (p.id = phi.punto_id)
        LEFT JOIN punto_insectos_tipo pit ON (p.tipo_id = pit.id)
        -- FROM punto_historial ph
		-- LEFT JOIN punto p ON (ph.punto_id = p.id)
		WHERE MONTH(phi.fechahora) = p_month AND YEAR(phi.fechahora) = p_year AND p.local_id = p_local_id
        AND phi.activo = 1
		group by p.id
        
        UNION
        
        SELECT
			'1' AS 'resultado',
            'ok' as 'mensaje',
            '*' AS 'PUNTO_ID',
            p_month as 'MES',
			p_year as 'YEAR',
			'-' as 'PUNTO_NOMBRE',
            '-' as 'PUNTOCONTROL_NUMERO',
			'-' as 'PUNTOCONTROL_UBICACION',
            '-' as 'PUNTOCONTROL_GEOLOCALIZACION',
            '-' as 'PUNTOCONTROL_TIPO',
            '-' as 'PUNTOCONTROL_TIPO_NC',
			SUM(phi.lepidopteros) as 'PUNTOHISTORIAL_LEPIDOPTEROS',
            SUM(phi.microlepidopteros) as 'PUNTOHISTORIAL_MICROLEPIDOPTEROS',
            SUM(phi.hemipteros) as 'PUNTOHISTORIAL_HEMIPTEROS',
            SUM(phi.coleopteros) as 'PUNTOHISTORIAL_COLEOPTEROS',
            SUM(phi.moscas) as 'PUNTOHISTORIAL_MOSCAS',
            SUM(phi.mosquitos) as 'PUNTOHISTORIAL_MOSQUITOS',
            SUM(phi.otros) as 'PUNTOHISTORIAL_OTROS',
            
            SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros) as 'PUNTOHISTORIAL_TOTAL',
            
            (SUM(phi.lepidopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_LE',
			
            (SUM(phi.microlepidopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_MLE',
            
            (SUM(phi.hemipteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_HE',
            
            (SUM(phi.coleopteros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_CO',
            
            (SUM(phi.moscas)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_M',
            
            (SUM(phi.mosquitos)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_MO',
            
            (SUM(phi.otros)/ (SUM(phi.lepidopteros) + SUM(phi.microlepidopteros) + SUM(phi.hemipteros)+ 
            SUM(phi.coleopteros)+ SUM(phi.moscas) + SUM(phi.mosquitos) + SUM(phi.otros)))*100 as 'PUNTOHISTORIAL_PRJ_O'
		FROM punto_insectos p
		LEFT JOIN punto_historial_insectos phi ON (p.id = phi.punto_id)
		WHERE MONTH(phi.fechahora) = p_month AND YEAR(phi.fechahora) = p_year AND p.local_id = p_local_id
        AND phi.activo = 1;
    ELSE
		SELECT '0' AS 'resultado', 'No existen registros para este mes o la empresa no cuenta con puntos de control' as 'mensaje';
    END IF;
END