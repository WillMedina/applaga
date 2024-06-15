CREATE PROCEDURE `desactivar_visita`(
	IN p_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    START TRANSACTION;
		IF (SELECT EXISTS(SELECT id FROM visita WHERE id = p_id AND activo = 1)) THEN
			UPDATE visita
            SET activo = 0,
            desactivacion = current_timestamp()
            WHERE id = p_id;
            
            /*
            UPDATE visita_documento
            SET activo = 0
            -- desactivacion = current_timestamp()
            WHERE visita_id = p_id;
            
            UPDATE visita_equipos
            SET activo = 0
            WHERE visita_id = p_id;
            
            UPDATE visita_operarios
            SET activo = 0
            WHERE visita_id = p_id;
            
            UPDATE visita_producto
            SET activo = 0
            WHERE visita_id = p_id;
            
            UPDATE visita_servicio
            SET activo = 0
            WHERE visita_id = p_id;
            */
            
            SELECT '1' AS 'resultado', 'EL SERVICIO HA SIDO REMOVIDO CORRECTAMENTE' AS 'mensaje',
            LAST_INSERT_ID() as 'SERVICIO_ID';
        ELSE
			SELECT '0' as 'resultado', 'EL SERVICIO NO EXISTE O YA HA SIDO DESACTIVADO' as 'mensaje',
            p_id as 'SERVICIO_ID';
        END IF;
    COMMIT;
END