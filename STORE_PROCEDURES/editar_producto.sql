CREATE PROCEDURE `editar_producto`(
	IN p_id INT,
	IN p_nombre VARCHAR(200),
    IN p_nombrecomercial VARCHAR(300),
    IN p_ingredienteactivo VARCHAR(300),
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
		IF (SELECT EXISTS(SELECT id FROM producto WHERE id = p_id AND activo = 1)) THEN
        
			UPDATE producto
            SET nombre = p_nombre,
            nombrecomercial = p_nombrecomercial,
            ingredienteactivo = p_ingredienteactivo,
            descripcion = p_descripcion,
            fichatecnica = p_fichatecnica
            WHERE id = p_id;
            
            SELECT '1' AS 'resultado', 'EL PRODUCTO HA SIDO ACTUALIZADO CORRECTAMENTE' AS 'mensaje',
            LAST_INSERT_ID() as 'PRODUCTO_ID';
        ELSE
			SELECT '0' as 'resultado', 'EL PRODUCTO NO EXISTE O HA SIDO DESACTIVADO' as 'mensaje',
            p_id as 'PRODUCTO_ID';
        END IF;
    COMMIT;
END