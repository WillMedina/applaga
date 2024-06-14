CREATE PROCEDURE `registrar_equipo`(
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
		INSERT INTO equipo(nombre, descripcion, ficha) 
        VALUES(p_nombre, p_descripcion, p_fichatecnica);
        
        SELECT '1' AS 'resultado',
        CONCAT('EL EQUIPO HA SIDO CORRECTAMENTE REGISTRADO CON ID ', LAST_INSERT_ID()) as 'mensaje';
    COMMIT;
END