CREATE PROCEDURE `obtener_visita_equipos`(
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
    
     IF (SELECT EXISTS(SELECT id FROM visita_equipos WHERE visita_id = p_visitaid and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			ve.visita_id as 'VISITA_ID',
            ve.equipo_id as 'EQUIPO_ID',
            ve.cantidad as 'CANTIDAD',
            ve.observaciones as 'OBSERVACIONES',
            e.nombre as 'NOMBRE',
            e.descripcion as 'DESCRIPCION',
            e.ficha as 'FICHA'
            FROM visita_equipos ve
            LEFT JOIN equipo e ON (ve.equipo_id = e.id)
            WHERE ve.visita_id = p_visitaid
            AND ve.activo = 1;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRARON EQUIPOS EN EL SERVICIO' AS 'mensaje';
    END IF;
    
END