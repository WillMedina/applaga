CREATE PROCEDURE `registrar_producto`(
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
		INSERT INTO producto(nombrecomercial, nombre, ingredienteactivo, descripcion, fichatecnica) 
        VALUES(p_nombrecomercial, p_nombre, p_ingredienteactivo, p_descripcion, p_fichatecnica);
        
        SELECT '1' AS 'resultado',
        CONCAT('EL PRODUCTO HA SIDO CORRECTAMENTE REGISTRADO CON ID ', LAST_INSERT_ID()) as 'mensaje';
    COMMIT;
END