CREATE PROCEDURE `obtener_punto_insectos`(
	IN p_id INT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		 @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		-- SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		-- SELECT @errno as 'resultado', CONCAT(@sqlstate,' ', @text) AS 'mensaje';
        SELECT '0' as 'resultado', CONCAT(@sqlstate,' ', @text, ' - ', @errno) AS 'mensaje';
	END;
    SET time_zone = '-5:00';
    
    IF (SELECT EXISTS(SELECT id FROM punto_insectos WHERE id = p_id AND activo=1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			p.id as 'PUNTOCONTROL_ID',
            p.codigo_unico as 'CODIGO_UNICO',
            p.nombre_punto as 'PUNTOCONTROL_NOMBRE',
            p.ubicacion_local as 'PUNTOCONTROL_UBICACION_LOCAL',
            p.numero as 'PUNTOCONTROL_NUMERO',
            p.modelo as 'PUNTOCONTROL_MODELO',
            p.geoloc as 'PUNTOCONTROL_GEOLOCALIZACION',
            t.nombre as 'PUNTOCONTROL_TIPO_NOMBRE',
            t.nombre_corto as 'PUNTOCONTROL_TIPO_NOMBRECORTO',
            t.descripcion as 'PUNTOCONTROL_TIPO_DESCRIPCION',
            l.id as 'CLIENTELOCAL_ID',
            l.nombreclave as 'CLIENTELOCAL_NOMBRECLAVE',
            l.direccion as 'CLIENTELOCAL_DIRECCION',
            l.frecuencia_Servicio as 'CLIENTELOCAL_FRECUENCIASERVICIO',
            l.telefono as 'CLIENTELOCAL_TELEFONO',
            l.email as 'CLIENTELOCAL_EMAIL',
            c.id as 'CLIENTE_ID',
            c.nombreclave as 'CLIENTE_NOMBRECLAVE',
            c.razonsocial as 'CLIENTE_RAZONSOCIAL',
            c.ruc as 'CLIENTE_RUC'
		FROM punto_insectos p 
        LEFT JOIN punto_insectos_tipo t ON (p.tipo_id = t.id)
        LEFT JOIN cliente_local l ON (p.local_id = l.id)
        LEFT JOIN cliente c ON (l.cliente_id = c.id)
        WHERE p.id = p_id
        AND p.activo = 1;
    ELSE
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRO PUNTO' AS 'mensaje', p_id as 'PUNTOCONTROL_ID';
    END IF;
END