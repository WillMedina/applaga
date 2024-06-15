CREATE PROCEDURE `listar_sesion_loginid`(
	IN p_login_id INT
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
			IF(SELECT EXISTS(select id from sesion where login_id = p_login_id and activo = 1)) THEN
				
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
                LEFT JOIN login l ON (s.login_id = l.id)
                WHERE s.login_id = p_login_id
                and s.activo = 1;
                
			ELSE
				SELECT 0 AS 'resultado', 'NO SE ENCONTRARON SESIONES ACTIVAS CON ESE ID' AS 'mensaje',
                p_login_id as 'LOGIN_ID';
			END IF;
END