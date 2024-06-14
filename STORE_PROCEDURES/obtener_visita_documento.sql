CREATE PROCEDURE `obtener_visita_documento`(
	IN p_visitaid INT
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
    
    -- ESTE SP LISTA TODOS LOS DOCUMENTOS DADO UN ID DE VISITA
    
    IF (SELECT EXISTS(SELECT id FROM visita_documento WHERE visita_id = p_visitaid and activo = 1)) THEN
		SELECT '1' AS 'resultado', 'ok' AS 'mensaje',
		vd.id as 'DOCUMENTO_ID',
        l.id as 'LOCAL_ID',
        c.id as 'CLIENTE_ID',
        c.nombreclave as 'CLIENTE_NOMBRECLAVE',
        c.razonsocial as 'CLIENTE_RAZONSOCIAL',
        vd.codigo_unico as 'CODIGO_UNICO_DOCUMENTO',
        vd.visita_id as 'VISITA_ID',
        vd.reemplaza_a as 'REEMPLAZA_A',
        vd.extension as 'EXTENSION',
        vd.creado as 'FECHA_CREACION',
        vd.nombre as 'NOMBRE',
        vd.autor as 'AUTOR',
        vd.descripcion as 'DESCRIPCION',
        vd.publicado as 'PUBLICADO_CLIENTE',
        vd.ruta as 'RUTA_DOCUMENTO',
        vd.recibido as 'RECIBIDO_CLIENTE'
        FROM visita_documento vd
        LEFT JOIN visita v ON (vd.visita_id = v.id)
        LEFT JOIN cliente_local l on (v.local_id = l.id)
        LEFT JOIN cliente c ON (l.cliente_id = c.id)
        WHERE vd.visita_id = p_visitaid
        AND vd.activo = 1;
    ELSE 
		SELECT '0' AS 'resultado',
        'NO SE ENCONTRARON DOCUMENTOS EN ESTE SERVICIO' AS 'mensaje';
    END IF;
END