CREATE PROCEDURE `buscar_equipos`()
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
		id as 'EQUIPO_ID',
        nombre as 'NOMBRE',
        descripcion as 'DESCRIPCION',
        ficha as 'FICHATECNICA',
        creacion as 'CREACION',
        desactivacion as 'DESACTIVACION'
	FROM equipo 
    WHERE activo = 1;
END