CREATE PROCEDURE `listar_locales_cliente`(
	IN p_clienteid INT
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
    
    SELECT '1' AS 'resultado', 'ok' as 'mensaje',
		id as 'LOCAL_ID',
        cliente_id as 'CLIENTE_ID',
        nombreclave as 'NOMBRECLAVE',
        direccion as 'DIRECCION',
        frecuencia_servicio as 'FRECUENCIA_SERVICIO',
        telefono as 'TELEFONO',
        email as 'EMAIL'
	FROM cliente_local 
    WHERE cliente_id = p_clienteid
    AND activo = 1;
END