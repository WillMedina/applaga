CREATE PROCEDURE `buscar_consumos_mes`(
	IN p_punto_id INT,
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
    SET lc_time_names = 'es_ES';
    
    SELECT
		ph.punto_id as 'PUNTO_ID',
        p_month as 'MES',
        p_year as 'AÑO',
        p.nombre_punto as 'PUNTO_NOMBRE',
        p.ubicacion_local as 'PUNTO_UBICACION',
        ROUND(AVG((ph.medida - ph.medida_inicial)),3) as 'PROM_CONSUMOS',
        SUM(ph.recambio) as 'RECAMBIOS',
        SUM(ph.hubo_consumo) as 'CONSUMOS',
        COUNT(ph.id) AS 'TOTAL_SERVICIOS',
        CONCAT(((SUM(ph.hubo_consumo)/COUNT(ph.id))*100), '%') AS 'PRJ_CONSUMOS',
        CONCAT(((SUM(ph.recambio)/COUNT(ph.id))*100), '%') AS 'PRJ_RECAMBIO'
	FROM punto_historial ph
		LEFT JOIN punto p ON (ph.punto_id = p.id)
    WHERE ph.punto_id = p_punto_id AND
    MONTH(ph.fechahora) = p_month AND YEAR(ph.fechahora) = p_year AND ph.activo = 1;
END