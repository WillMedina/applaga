CREATE PROCEDURE `buscar_opcampo`()
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
		id as 'USUARIO_ID',
		nombres as 'NOMBRES',
        apellidos as 'APELLIDOS',
        dni as 'DNI'
	FROM usuario
    WHERE activo = 1 AND op_en_campo = 1;
        
END