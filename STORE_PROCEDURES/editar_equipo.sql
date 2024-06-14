CREATE PROCEDURE `editar_equipo`(
	IN p_id INT,
	IN p_nombre VARCHAR(200),
    IN p_descripcion TEXT,
    IN p_fichatecnica TEXT
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
		IF (SELECT EXISTS(SELECT id FROM equipo WHERE id = p_id AND activo = 1)) THEN
        
			UPDATE equipo
            SET nombre = p_nombre,
            descripcion = p_descripcion,
            ficha = p_fichatecnica
            WHERE id = p_id;
            
            SELECT '1' AS 'resultado', 'EL EQUIPO HA SIDO ACTUALIZADO CORRECTAMENTE' AS 'mensaje',
            LAST_INSERT_ID() as 'EQUIPO_ID';
        ELSE
			SELECT '0' as 'resultado', 'EL EQUIPO NO EXISTE O HA SIDO DESACTIVADO' as 'mensaje',
            p_id as 'EQUIPO_ID';
        END IF;
    COMMIT;
END