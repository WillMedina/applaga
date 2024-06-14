CREATE PROCEDURE `obtener_punto_uuid`(
	IN p_codigo_unico VARCHAR(36)
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
    
    IF (SELECT EXISTS(SELECT id FROM punto WHERE codigo_unico = p_codigo_unico and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' as 'mensaje',
			p.id as 'PUNTOCONTROL_ID',
            p.codigo_unico as 'CODIGO_UNICO'
            /*-- p.local_id as 'CLIENTELOCAL_ID',
            -- p.unidadmedida_id as 'UNIDADMEDIDA_ID',
            p.nombre_punto as 'PUNTOCONTROL_NOMBRE',
            p.ubicacion_local as 'PUNTOCONTROL_UBICACION_LOCAL',
            p.numero as 'PUNTOCONTROL_NUMERO',
            p.geoloc as 'PUNTOCONTROL_GEOLOCALIZACION',
            um.id as 'UNIDADMEDIDA_ID',
            um.nombre as 'UNIDADMEDIDA_NOMBRE',
            um.descripcion as 'UNIDADMEDIDA_DESCRIPCION',
            um.simbolo as 'UNIDADMEDIDA_SIMBOLO',
            l.id as 'CLIENTELOCAL_ID',
            l.nombreclave as 'CLIENTELOCAL_NOMBRECLAVE',
            l.direccion as 'CLIENTELOCAL_DIRECCION',
            l.frecuencia_Servicio as 'CLIENTELOCAL_FRECUENCIASERVICIO',
            l.telefono as 'CLIENTELOCAL_TELEFONO',
            l.email as 'CLIENTELOCAL_EMAIL',
            c.id as 'CLIENTE_ID',
            c.nombreclave as 'CLIENTE_NOMBRECLAVE',
            c.razonsocial as 'CLIENTE_RAZONSOCIAL',
            c.ruc as 'CLIENTE_RUC'*/
		FROM punto p 
        LEFT JOIN cliente_local l ON (p.local_id = l.id)
        LEFT JOIN cliente c ON (l.cliente_id = c.id)
        LEFT JOIN unidadmedida um ON (p.unidadmedida_id = um.id)
        WHERE p.codigo_unico = p_codigo_unico
        AND p.activo = 1;
    ELSE
		SELECT '0' AS 'resultado', 'NO SE ENCONTRARON PUNTOS CON ESE CODIGO UNICO' AS 'mensaje', p_codigo_unico as 'CODIGO_UNICO';
    END IF;
END