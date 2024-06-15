CREATE PROCEDURE `registrar_visita_servicio`(
	IN p_visitaid INT,
    IN p_tiposervicioid INT
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
		INSERT INTO visita_servicio(visita_id, tiposervicio_id)
        VALUES(p_visitaid, p_tiposervicioid);
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
        LAST_INSERT_ID() as 'VISITA_SERVICIO_ID', CURRENT_TIMESTAMP() AS 'REGISTRADO_EN';
    COMMIT;
END