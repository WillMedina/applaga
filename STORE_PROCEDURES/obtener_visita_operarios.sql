CREATE PROCEDURE `obtener_visita_operarios`(
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
    
    IF (SELECT EXISTS(SELECT id FROM visita_operarios WHERE visita_id = p_visitaid and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			vo.visita_id as 'VISITA_ID',
            vo.usuario_id as 'USUARIO_ID',
            vo.supervisor as 'SUPERVISOR',
            u.nombres as 'NOMBRES',
            u.apellidos as 'APELLIDOS',
            u.dni as 'DNI',
            u.activo as 'USUARIO_ACTIVO'
            FROM visita_operarios vo
            LEFT JOIN usuario u ON (vo.usuario_id = u.id)
            WHERE vo.visita_id = p_visitaid
            AND vo.activo = 1;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRARON OPERARIOS INVOLUCRADOS' AS 'mensaje';
    END IF;
END