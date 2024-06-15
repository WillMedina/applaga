CREATE PROCEDURE `registrar_cliente`(
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
		INSERT INTO cliente(nombreclave, razonsocial, ruc)
        VALUES(p_nombreclave, p_razonsocial, p_ruc);
        
        SELECT '1' as 'resultado', 
        CONCAT('EL CLIENTE [',p_nombreclave,'] ',p_razonsocial,' CON RUC ', p_ruc,' HA SIDO CORRECTAMENTE REGISTRADO CON ID ', LAST_INSERT_ID()) AS 'mensaje';
    COMMIT;
END