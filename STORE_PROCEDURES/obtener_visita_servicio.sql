CREATE PROCEDURE `obtener_visita_servicio`(
	IN p_visitaid INT
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
    
    IF (SELECT EXISTS(SELECT id FROM visita_servicio WHERE visita_id = p_visitaid and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			vs.visita_id as 'VISITA_ID',
            vs.tiposervicio_id as 'TIPOSERVICIO_ID',
            ts.nombre as 'SERVICIO',
            ts.descripcion as 'DESCRIPCION',
            ts.activo as 'SERVICIO_ACTIVO'
            FROM visita_servicio vs 
            LEFT JOIN tiposervicio ts ON (vs.tiposervicio_id = ts.id)
            WHERE vs.visita_id = p_visitaid
            AND vs.activo = 1;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRARON SERVICIOS EN ESTA VISITA' AS 'mensaje';
    END IF;
END