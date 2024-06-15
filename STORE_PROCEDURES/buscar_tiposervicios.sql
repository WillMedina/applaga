CREATE PROCEDURE `buscar_tiposervicios`()
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
    
    SELECT '1' as 'resultado', 'ok' as 'mensaje',
		id as 'TIPOSERVICIO_ID',
        nombre as 'NOMBRE',
        descripcion as 'DESCRIPCION'
	FROM tiposervicio 
    WHERE activo = 1;
END