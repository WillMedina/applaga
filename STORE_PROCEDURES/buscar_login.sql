CREATE PROCEDURE `buscar_login`(
	IN p_usuario VARCHAR(60)
)
BEGIN
	DECLARE TIPO_TABLA ENUM('usuario','cliente');
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    SET TIPO_TABLA = (SELECT tabla FROM login WHERE usuario = p_usuario and activo = 1);
    
    IF TIPO_TABLA = 'usuario' THEN
    
	    SELECT '1' as 'resultado',
			'OK' as 'mensaje',
            l.id as 'LOGIN_ID',
            l.usuario as 'USUARIO',
            l.`hash` as 'HASH',
            l.tabla as 'TABLA',
            u.id as 'USUARIO_ID',
            u.nombres as 'NOMBRES',
            u.apellidos as 'APELLIDOS',
            u.dni as 'DNI',
            u.activo as 'USUARIO_ACTIVO',
            tu.id as 'TIPOUSUARIO_ID',
            tu.nombre as 'TIPOUSUARIO'
        FROM login l 
        LEFT JOIN usuario_login ul ON (l.id = ul.login_id)
        LEFT JOIN usuario u ON (ul.usuario_id = u.id)
        LEFT JOIN tipousuario tu ON (u.tipousuario_id = tu.id)
        WHERE l.usuario = p_usuario
        AND l.activo = 1;
        
	ELSEIF TIPO_TABLA = 'cliente' THEN
		SELECT '1' as 'resultado',
			
			'OK' as 'mensaje',
            l.id as 'LOGIN_ID',
            l.usuario as 'USUARIO',
            l.`hash` as 'HASH',
            l.tabla as 'TABLA',
            c.id as 'CLIENTE_ID',
            c.nombreclave as 'CLIENTE_NOMBRECLAVE',
            c.razonsocial as 'RAZONSOCIAL',
            c.ruc as 'RUC',
            c.activo as 'CLIENTE_ACTIVO'
        FROM login l 
        LEFT JOIN cliente_login cl ON (l.id = cl.login_id)
        LEFT JOIN cliente c ON (cl.cliente_id = c.id)
        WHERE l.usuario = p_usuario
        AND l.activo = 1;
        
	ELSE
	  SELECT '0' AS 'resultado' , 'NO SE HA ENCONTRADO EL USUARIO' AS 'mensaje';
	END IF;
END