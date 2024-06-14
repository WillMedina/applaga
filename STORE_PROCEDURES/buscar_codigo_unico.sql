CREATE PROCEDURE `buscar_codigo_unico`(
	IN p_codigo_unico VARCHAR(36)
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
    
    IF (SELECT EXISTS (SELECT id FROM punto WHERE codigo_unico = p_codigo_unico)) THEN
		
        SELECT '1' as 'RESULTADO', 
        'OK' AS 'MENSAJE',
        id AS 'ID', 
        codigo_unico as 'CODIGO_UNICO', 
        'punto' as 'TABLA' FROM punto 
        WHERE codigo_unico = p_codigo_unico;
        
	ELSEIF(SELECT EXISTS(SELECT id FROM punto_insectos WHERE codigo_unico = p_codigo_unico)) THEN
		
        SELECT '1' as 'RESULTADO', 
        'OK' AS 'MENSAJE',
        id AS 'ID', 
        codigo_unico AS 'CODIGO_UNICO', 
        'punto_insectos' AS 'TABLA' FROM punto_insectos
        WHERE codigo_unico = p_codigo_unico;
        
	ELSE
		
        SELECT '0' as 'RESULTADO',
        'NO EXISTE NINGUN PUNTO CON EL CODIGO UNICO INGRESADO' AS 'MENSAJE',
        p_codigo_unico as 'CODIGO_UNIC0',
        'NONE' AS 'TABLA';
        
    END IF;
    
END