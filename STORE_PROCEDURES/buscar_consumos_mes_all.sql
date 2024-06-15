CREATE PROCEDURE `buscar_consumos_mes_all`(
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
		SELECT ph.id 
		FROM punto_historial ph LEFT JOIN punto p ON (ph.punto_id = p.id)
        WHERE p.local_id = p_local_id AND MONTH(ph.fechahora) = p_month
        AND YEAR(ph.fechahora) = p_year
	)) THEN
		-- si hay existencias las formatea
		SELECT 
			'1' as 'resultado',
            'ok' as 'mensaje',
			ph.punto_id as 'PUNTO_ID',
			p_month as 'MES',
			p_year as 'YEAR',
			p.nombre_punto as 'PUNTO_NOMBRE',
            p.numero as 'PUNTOCONTROL_NUMERO',
			p.ubicacion_local as 'PUNTOCONTROL_UBICACION',
			ROUND(AVG((ph.medida_inicial - ph.medida)), 3) as 'PROM_CONSUMOS',
			SUM(ph.recambio) as 'RECAMBIOS',
			SUM(ph.hubo_consumo) as 'CONSUMOS',
			COUNT(ph.id) AS 'TOTAL_SERVICIOS',
			CONCAT(ROUND(((SUM(ph.hubo_consumo)/COUNT(ph.id))*100),3), '%') AS 'PRJ_CONSUMOS',
			CONCAT(ROUND(((SUM(ph.recambio)/COUNT(ph.id))*100),3), '%') AS 'PRJ_RECAMBIO'
            
		FROM punto p
		LEFT JOIN punto_historial ph ON (p.id = ph.punto_id)
        -- FROM punto_historial ph
		-- LEFT JOIN punto p ON (ph.punto_id = p.id)
		WHERE MONTH(ph.fechahora) = p_month AND YEAR(ph.fechahora) = p_year AND p.local_id = p_local_id
        AND ph.activo = 1
		group by punto_id
        
        UNION
        
        SELECT
			'1' AS 'resultado',
            'ok' as 'mensaje',
            '*' AS 'PUNTO_ID',
            p_month as 'MES',
			p_year as 'YEAR',
			'TOTAL' as 'PUNTO_NOMBRE',
            '-' as 'PUNTOCONTROL_NUMERO',
			'TOTAL' as 'PUNTOCONTROL_UBICACION',
			ROUND(AVG((ph.medida_inicial - ph.medida)),3) as 'PROM_CONSUMOS',
            -- ROUND((SUM(ph.medida_inicial - ph.medida)/COUNT(p.id)),3) as 'PROM_CONSUMOS',
			SUM(ph.recambio) as 'RECAMBIOS',
			SUM(ph.hubo_consumo) as 'CONSUMOS',
			COUNT(ph.id) AS 'TOTAL_SERVICIOS',
			-- CONCAT(((SUM(ph.hubo_consumo)/COUNT(ph.id))*100), '%') AS 'PRJ_CONSUMOS',
			-- CONCAT(((SUM(ph.recambio)/COUNT(ph.id))*100), '%') AS 'PRJ_RECAMBIO'
			'--' AS 'PRJ_CONSUMOS',
			'--' AS 'PRJ_RECAMBIO'
		FROM punto p
		LEFT JOIN punto_historial ph ON (p.id = ph.punto_id)
		WHERE MONTH(ph.fechahora) = p_month AND YEAR(ph.fechahora) = p_year AND p.local_id = p_local_id
        AND ph.activo = 1;
    ELSE
		SELECT '0' AS 'resultado', 'No existen registros para este mes o la empresa no cuenta con puntos de control' as 'mensaje';
    END IF;
END