CREATE PROCEDURE `buscar_productos`()
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
		id as 'PRODUCTO_ID',
        nombre as 'NOMBRE',
        nombrecomercial as 'NOMBRECOMERCIAL',
        ingredienteactivo as 'INGREDIENTEACTIVO',
        fichatecnica as 'FICHATECNICA',
        creacion as 'CREACION',
        desactivacion as 'DESACTIVACION',
        descripcion as 'DESCRIPCION'
	FROM producto 
    WHERE activo = 1;
END