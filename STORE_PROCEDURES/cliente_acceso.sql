CREATE PROCEDURE `cliente_acceso`(
	IN p_cliente_usuario VARCHAR(60)
)
BEGIN
	DECLARE P_LOGIN_ID INT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		-- SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
        SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text, ' - ', @errno) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    IF (SELECT EXISTS (SELECT id FROM login WHERE usuario = p_cliente_usuario AND activo = 1)) THEN
		SET P_LOGIN_ID = (SELECT id FROM login WHERE usuario = p_cliente_usuario);
			
		IF (SELECT EXISTS (SELECT id FROM cliente_login WHERE login_id = P_LOGIN_ID and activo = 1)) THEN
			SELECT '1' as 'resultado', 'ok' as 'mensaje', 
				id as 'CLIENTE_LOGIN_ID',
                cliente_id as 'CLIENTE_ID',
                restringir_local_id as 'LOCAL_ID_ACCESO',
                login_id as 'LOGIN_ID'
            FROM cliente_login 
            WHERE login_id = P_LOGIN_ID
            AND activo = 1;
		ELSE
			SELECT '0' AS 'resultado', 'ESTE USUARIO NO TIENE ACCESOS DE NIVEL CLIENTE EN EL SISTEMA' AS 'mensaje';
        END IF;
    ELSE
		SELECT '0' AS 'resultado', 'NO EXISTE EL USUARIO ESPECIFICADO' AS 'mensaje';
    END IF;
    
END