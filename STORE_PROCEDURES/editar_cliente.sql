CREATE PROCEDURE `editar_cliente`(
	IN p_id INT,
    IN p_nombreclave VARCHAR(250),
    IN p_razonsocial VARCHAR(250),
    IN p_ruc VARCHAR(11)
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
		IF (SELECT EXISTS(SELECT id FROM cliente WHERE id = p_id AND activo = 1)) THEN
			UPDATE cliente
            SET nombreclave = p_nombreclave,
            razonsocial = p_razonsocial,
            ruc = p_ruc
            WHERE id = p_id;
            
            SELECT '1' AS 'resultado', 'EL CLIENTE HA SIDO ACTUALIZADO CORRECTAMENTE' AS 'mensaje',
            LAST_INSERT_ID() as 'CLIENTE_ID';
        ELSE
			SELECT '0' as 'resultado', 'EL CLIENTE NO EXISTE O HA SIDO DESACTIVADO' as 'mensaje',
            p_id as 'CLIENTE_ID';
        END IF;
    COMMIT;
END