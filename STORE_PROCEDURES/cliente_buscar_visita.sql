CREATE PROCEDURE `cliente_buscar_visita`(
	IN p_localid INT,
    IN p_fecha1 DATE,
    IN p_fecha2 DATE
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
    
    SELECT '1' AS 'resultado', 'ok' as 'mensaje',
		id as 'VISITA_ID',
		codigo_unico as 'CODIGO_UNICO',
		local_id as 'LOCAL_ID',
		responsable_local AS 'RESPONSABLE',
		cargo_responsable_local as 'CARGO_RESPONSABLE',
		n_constancia as 'NUMERO_COSTANCIA',
		inicio as 'INICIO',
		fin as 'FIN',
		n_certificado as 'NUMERO_CERTIFICADO',
        vencimiento_certificado as 'VENCIMIENTO_CERTIFICADO',
        observaciones_recomendaciones as 'OBS_REC',
        observaciones_cliente as 'OBS_CLI',
        condiciones_internas as 'CONDICIONES_INTERNAS',
        condiciones_externas as 'CONDICIONES_EXTERNAS',
        visto_bueno as 'VISTO_BUENO'
	FROM visita
    WHERE local_id = p_localid 
    AND inicio BETWEEN p_fecha1 AND p_fecha2
    AND activo = 1;
END