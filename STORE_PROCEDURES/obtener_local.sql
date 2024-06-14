CREATE PROCEDURE `obtener_local`(
	IN p_id INT
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
    
     IF(SELECT EXISTS(SELECT id FROM cliente_local WHERE id = p_id AND activo = 1)) THEN
		-- LOCAL_ID, CLIENTE_ID, NOMBRECLAVE, DIRECCION, FRECUENCIA_SERVICIO, TELEFONO, EMAIL
        SELECT '1' as 'resultado', 'ok' as 'mensaje',
			id as 'LOCAL_ID',
            cliente_id as 'CLIENTE_ID',
            nombreclave as 'NOMBRECLAVE',
            direccion as 'DIRECCION',
            frecuencia_servicio as 'FRECUENCIA_SERVICIO',
            telefono as 'TELEFONO',
            email as 'EMAIL'
		FROM cliente_local
        WHERE id = p_id
        AND activo = 1;
     ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRO EL LOCAL REFERIDO' AS 'mensaje',
        p_id as 'LOCAL_ID';
     END IF;
END