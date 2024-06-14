CREATE PROCEDURE `listar_sesion_cookie`(
	IN p_cookie TEXT
)
BEGIN
	DECLARE TIEMPO_TRANSCURRIDO VARCHAR(200);
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
	END;
	SET time_zone = '-5:00';
    
		IF(SELECT EXISTS(select id from sesion WHERE cookie = p_cookie and activo = 1)) THEN 
			SET TIEMPO_TRANSCURRIDO = (SELECT TIMEDIFF(NOW(), f_inicio) FROM sesion WHERE cookie= p_cookie);
			SELECT 1 AS 'resultado', 'OK' as 'mensaje',
					s.id as 'SESION_ID',
					s.login_id as 'LOGIN_ID',
					l.usuario as 'USUARIO',
                    l.tabla as 'TIPO',
					s.f_inicio as 'FINICIO',
						/*(CONCAT(
							TIMESTAMPDIFF(YEAR, s.f_inicio, NOW()), ' años, ',
							TIMESTAMPDIFF(DAY, s.f_inicio, NOW()), ' dias, ',
                            TIMESTAMPDIFF(HOUR, s.f_inicio, NOW()), ' horas, ',
                            TIMESTAMPDIFF(MINUTE, s.f_inicio, NOW()), ' minutos y ',
                            TIMESTAMPDIFF(SECOND, s.f_inicio, NOW()), ' segundos'
                        )) 
                        as 'TIEMPO_TRANSCURRIDO', */
                        CONCAT(
							FLOOR(HOUR(TIEMPO_TRANSCURRIDO) / 24), ' día(s), ',
							MOD(HOUR(TIEMPO_TRANSCURRIDO), 24), ' hora(s), ',
							MINUTE(TIEMPO_TRANSCURRIDO), ' minuto(s), ',
							SECOND(TIEMPO_TRANSCURRIDO), ' segundo(s)'
						) as 'TIEMPO_TRANSCURRIDO',
                    s.cookie as 'COOKIE',
					-- s.f_fin as 'FFIN',
					s.ip as 'IP',
					s.browser_agent as 'BROWSER'
                FROM sesion s
                LEFT JOIN login l ON (s.login_id = l.id)
                WHERE s.cookie = p_cookie
                AND s.activo = 1;
        ELSE
			SELECT 0 AS 'resultado', 'NO SE ENCONTRARON SESIONES ACTIVAS CON ESE CODIGO DE COOKIE' AS 'mensaje',
            p_cookie as 'COOKIE_CODE';
        END IF;
    
END