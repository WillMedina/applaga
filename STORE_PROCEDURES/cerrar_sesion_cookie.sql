CREATE PROCEDURE `cerrar_sesion_cookie`(
	IN p_cookie TEXT
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
		IF(select exists(select id from sesion where cookie = p_cookie and activo = 1)) THEN
			UPDATE sesion 
            SET f_fin = CURRENT_TIMESTAMP(), activo = 0
			WHERE cookie = p_cookie;
            
            SELECT 1 AS 'resultado', 'SESION FINALIZADA CORRECTAMENTE', p_cookie as 'COOKIE_CODE';
		ELSE 
			SELECT '0' AS 'resultado', 'NO SE ENCONTRO NINGUNA SESION ABIERTA CON ESE COOKIE' AS 'mensaje',
            p_cookie as 'COOKIE_CODE';
        END IF;
    COMMIT;
END