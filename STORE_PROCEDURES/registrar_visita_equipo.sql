CREATE PROCEDURE `registrar_visita_equipo`(
	IN p_visitaid INT,
    IN p_equipoid INT,
    IN p_cantidad DOUBLE,
    IN p_observaciones TEXT
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
		INSERT INTO visita_equipos(visita_id, equipo_id, cantidad, observaciones)
        VALUES(p_visitaid, p_equipoid, p_cantidad, p_observaciones);
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
        LAST_INSERT_ID() as 'VISITA_EQUIPO_ID', CURRENT_TIMESTAMP() AS 'REGISTRADO_EN';
    COMMIT;
END