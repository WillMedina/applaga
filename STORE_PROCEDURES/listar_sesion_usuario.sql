CREATE PROCEDURE `listar_sesion_usuario`(
	IN p_usuario VARCHAR(60)
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
   
		IF(SELECT EXISTS(select id from login where usuario = p_usuario and activo = 1)) THEN
			IF(SELECT EXISTS(select s.id from sesion s 
				join login l on (s.login_id = l.id) 
				where l.usuario = p_usuario 
                and s.activo = 1)) THEN
				
                SELECT 1 as 'resultado', 'OK' as 'mensaje',
					s.id as 'SESION_ID',
					s.login_id as 'LOGIN_ID',
					l.usuario as 'USUARIO',
                    l.tabla as 'TIPO',
					s.f_inicio as 'FINICIO',
                    s.cookie as 'COOKIE',
					-- s.f_fin as 'FFIN',
					s.ip as 'IP',
					s.browser_agent as 'BROWSER'
                FROM sesion s
                JOIN login l ON (s.login_id = l.id)
                -- WHERE s.login_id = p_login
                WHERE l.usuario = p_usuario
                and s.activo = 1;
                
			ELSE
				SELECT 0 AS 'resultado', 'NO SE ENCONTRARON SESIONES ACTIVAS CON ESE USUARIO' AS 'mensaje', p_usuario as 'USUARIO';
			END IF;
		ELSE
			SELECT 0 AS 'resultado', 'EL USUARIO NO EXISTE' AS 'mensaje', p_usuario as 'USUARIO';
		END IF;

END