CREATE PROCEDURE `accesocliente_visita`(
	IN p_cliente_login VARCHAR(60),
    IN p_visita_id INT
)
BEGIN
	DECLARE PERMISO_LOCAL INT DEFAULT 0;
    DECLARE P_CLIENTE_ID_LOGIN INT DEFAULT 0;
    DECLARE P_CLIENTE_ID_VISITA INT DEFAULT 0;
    DECLARE LOCAL_ID_VISITA INT DEFAULT 0;
    
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		-- SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
        SELECT '0' as 'resultado', CONCAT(@sqlstate,' ', @text, ' - ', @errno) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    IF (SELECT EXISTS(SELECT id FROM visita WHERE id = p_visita_id)) THEN
		IF (SELECT EXISTS(SELECT id FROM login WHERE usuario = p_cliente_login AND tabla = 'cliente' AND activo = 1)) THEN
			SET PERMISO_LOCAL = (
				SELECT restringir_local_id FROM cliente_login WHERE login_id IN (SELECT id FROM login WHERE usuario = p_cliente_login)
			);
            
            SET P_CLIENTE_ID_LOGIN = (
				SELECT cliente_id FROM cliente_login WHERE login_id IN (SELECT id FROM login WHERE usuario = p_cliente_login)
			);
            
            SET P_CLIENTE_ID_VISITA = (
				SELECT cliente_id FROM cliente_local WHERE id IN (SELECT local_id FROM visita WHERE id = p_visita_id) 
            );
            
            SET LOCAL_ID_VISITA = (
				SELECT local_id FROM visita WHERE id = p_visita_id
            );
            
            IF PERMISO_LOCAL = 0 THEN
				IF P_CLIENTE_ID_LOGIN = P_CLIENTE_ID_VISITA THEN
					SELECT '1' AS 'resultado', 'OK' as 'mensaje', '1' as 'ACCESO';
				ELSE
					SELECT '0' AS 'resultado', 'LA VISITA NO PERTENECE A ESTE CLIENTE' as 'mensaje', '0' as 'ACCESO';
				END IF;
            ELSE
				IF PERMISO_LOCAL = LOCAL_ID_VISITA THEN
					SELECT '1' AS 'resultado', 'OK' as 'mensaje', '1' as 'ACCESO';
				ELSE
					SELECT '0' AS 'resultado', 'EL USUARIO NO TIENE ACCESO A ESTA VISITA' as 'mensaje', '0' as 'ACCESO';
				END IF;
            END IF;
        ELSE
			SELECT '0' AS 'resultado', 'EL USUARIO INGRESADO NO EXISTE O NO ES CLIENTE (O NO ESTÁ ACTIVO PARA AUTORIZACIÓN)' as 'mensaje', '0' as 'ACCESO';
        END IF;
	ELSE
		SELECT '0' AS 'resultado', 'LA VISITA INGRESADA NO EXISTE' as 'mensaje', '0' as 'ACCESO';
    END IF;
END

