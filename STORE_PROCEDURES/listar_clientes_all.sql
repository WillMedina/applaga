CREATE PROCEDURE `listar_clientes_all`()
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    SELECT '1' AS 'resultado', 'ok' as 'mensaje',
		id as 'CLIENTE_ID',
        nombreclave as 'NOMBRECLAVE',
        razonsocial as 'RAZONSOCIAL',
        ruc as 'RUC'
	FROM cliente WHERE activo = 1;
END