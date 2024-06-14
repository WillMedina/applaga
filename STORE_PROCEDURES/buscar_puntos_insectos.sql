CREATE PROCEDURE `buscar_puntos_insectos`(
	IN p_localid INT
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
    
    IF (SELECT EXISTS(SELECT id FROM punto_insectos WHERE local_id = p_localid and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'OK' as 'mensaje',
			p.id as 'PUNTOCONTROL_ID',
            p.codigo_unico as 'CODIGO_UNICO',
            p.local_id as 'LOCAL_ID',
            p.nombre_punto as 'PUNTOCONTROL_NOMBRE',
            p.ubicacion_local as 'PUNTOCONTROL_UBICACION',
            p.numero as 'PUNTOCONTROL_NUMERO',
            p.geoloc as 'PUNTOCONTROL_GEOLOC',
            p.modelo as 'MODELO',
            l.nombreclave as 'LOCAL_NOMBRECLAVE',
            l.direccion as 'LOCAL_DIRECCION',
            l.frecuencia_servicio as 'LOCAL_FRECUENCIASERVICIO',
            l.telefono as 'LOCAL_TELEFONO',
            l.email as 'LOCAL_EMAIL',
            c.nombreclave as 'CLIENTE_NOMBRECLAVE',
            c.razonsocial as 'CLIENTE_RAZONSOCIAL',
            c.ruc as 'CLIENTE_RUC'
		FROM punto_insectos p 
        LEFT JOIN cliente_local l ON (p.local_id = l.id)
        LEFT JOIN cliente c ON (l.cliente_id = c.id)
        WHERE p.local_id = p_localid
        and p.activo = 1;
    ELSE
		SELECT '0' AS 'resultado', 'NO SE ENCONTRARON PUNTOS DE CONTROL EN ESTE LOCAL' AS 'mensaje', p_localid as 'LOCAL_ID';
	END IF;
END